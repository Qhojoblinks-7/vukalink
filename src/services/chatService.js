// src/services/chatService.js
import { supabase } from '../services/supabaseClient';

export const chatService = {
  /**
   * Fetches all conversations for the current authenticated user.
   */
  async getMyConversations() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to get conversations.");
    if (!user) return [];

    // Select conversations where the user is a participant
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        unread_count,
        conversations(*),
        user_id,
        profiles(full_name) -- The current user's profile
      `)
      .eq('user_id', user.id)
      .order('last_message_at', { foreignTable: 'conversations', ascending: false });

    if (error) {
      throw new Error(`Error fetching user conversations: ${error.message}`);
    }

    // Now, for each conversation, get the *other* participant's details
    const conversationsWithOtherParticipant = await Promise.all(data.map(async (cp) => {
      // Get all participants for this conversation
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id, profiles(full_name, avatar_url)')
        .eq('conversation_id', cp.conversation_id);

      if (participantsError) {
        console.error("Error fetching participants for conversation:", participantsError.message);
        return { ...cp, other_participant: null };
      }

      // Find the participant who is not the current user
      const otherParticipant = participantsData.find(p => p.user_id !== user.id);

      return {
        ...cp,
        other_participant: otherParticipant ? otherParticipant.profiles : null,
      };
    }));

    return conversationsWithOtherParticipant;
  },

  /**
   * Fetches messages for a specific conversation.
   * RLS ensures only participants can access messages.
   */
  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(id, full_name, avatar_url)') // Get sender's profile info
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching messages for conversation ${conversationId}: ${error.message}`);
    }
    return data;
  },

  /**
   * Sends a new message in a conversation.
   * RLS ensures only participants can send.
   */
  async sendMessage(conversationId, content) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to send message.");
    if (!user) throw new Error("No user logged in.");

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
      })
      .select();

    if (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Marks a conversation's unread count to zero for the current user.
   */
  async markConversationAsRead(conversationId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to mark conversation as read.");
    if (!user) throw new Error("No user logged in.");

    const { error } = await supabase
      .from('conversation_participants')
      .update({ unread_count: 0 })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Error marking conversation ${conversationId} as read: ${error.message}`);
    }
    return true;
  },

  /**
   * Initiates a new conversation between two users.
   * This calls the Supabase Edge Function (RPC) that we defined earlier.
   */
  async startNewConversation(targetUserId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to start conversation.");
    if (!user) throw new Error("No user logged in.");

    if (user.id === targetUserId) {
        throw new Error("Cannot start a conversation with yourself.");
    }

    // Check if a conversation already exists between these two users
    const { data: existingConversations, error: existingError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .in('user_id', [user.id, targetUserId])
        .having('count(conversation_id)', 'eq', 2); // Check if both users are in the same conv

    if (existingError) {
        throw new Error(`Error checking existing conversation: ${existingError.message}`);
    }

    if (existingConversations && existingConversations.length > 0) {
        return existingConversations[0].conversation_id; // Return existing conversation ID
    }

    // If no existing conversation, call the RPC to create a new one
    const { data, error } = await supabase.rpc('create_conversation', {
      user1_id: user.id,
      user2_id: targetUserId,
    });

    if (error) {
      throw new Error(`Error starting new conversation: ${error.message}`);
    }
    return data; // This is the new conversation_id
  },

  /**
   * Set up a real-time subscription for messages in a specific conversation.
   * @param {string} conversationId - The ID of the conversation to subscribe to.
   * @param {function} callback - Function to call when new messages arrive.
   * @returns {object} The Supabase RealtimeChannel instance.
   */
  subscribeToMessages(conversationId, callback) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new) // payload.new contains the new message data
      )
      .subscribe();

    return channel;
  },

  /**
   * Remove a real-time subscription.
   * @param {object} channel - The Supabase RealtimeChannel instance returned by subscribeToMessages.
   */
  async unsubscribeFromMessages(channel) {
    if (channel) {
      await supabase.removeChannel(channel);
    }
  },

  /**
   * Set up a real-time subscription for a user's new messages (for overall unread count or new conversations).
   * This might be used globally, e.g., in an AppLayout component.
   * @param {string} userId - The ID of the user to subscribe for.
   * @param {function} callback - Function to call when a new message relevant to the user arrives.
   * @returns {object} The Supabase RealtimeChannel instance.
   */
  subscribeToUserNewMessages(userId, callback) {
    const channel = supabase
      .channel(`user_messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          // Only trigger for messages sent by others in conversations the user is part of
          filter: `NOT sender_id=eq.${userId}`
        },
        async (payload) => {
          // Verify the user is a participant in this conversation
          const { count, error } = await supabase
            .from('conversation_participants')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', payload.new.conversation_id)
            .eq('user_id', userId);

          if (error) {
            console.error("Error checking participation for new message:", error.message);
            return;
          }

          if (count > 0) {
            // Fetch sender profile for the notification
            const { data: senderProfile, error: senderError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();

            if (senderError) {
                console.error("Error fetching sender profile:", senderError.message);
            }

            callback({
                ...payload.new,
                sender_name: senderProfile ? senderProfile.full_name : 'Unknown User'
            });
          }
        }
      )
      .subscribe();

    return channel;
  },
};