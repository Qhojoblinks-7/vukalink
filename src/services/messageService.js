import { supabase } from '../services/supabaseClient'; // Make sure this path is correct for your Supabase client instance

const messageService = {

  /**
   * Fetches all conversations for the authenticated user, including participant details and unread counts.
   * @param {string} userId The ID of the currently authenticated user.
   * @returns {Array} An array of conversation summary objects.
   */
  async fetchConversations(userId) { // Renamed from getConversations to match user's page code
    if (!userId) {
      console.error("fetchConversations: User ID is required.");
      return [];
    }

    try {
      // Step 1: Get all conversation IDs the user is part of, along with their unread_count and last_read_at
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count, last_read_at')
        .eq('user_id', userId);

      if (participantError) throw participantError;

      const conversationIds = participantData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        return []; // No conversations found for this user
      }

      // Step 2: Fetch the conversation details and the last message for each
      // Using a join to get last_message_at from conversations and content from messages
      const { data: conversationsWithLastMessage, error: convoError } = await supabase
        .from('conversations')
        .select(`
          id,
          last_message_at,
          messages (
            content,
            created_at,
            sender_id
          )
        `)
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false }); // Sort by most recent message

      if (convoError) throw convoError;

      // Step 3: Fetch all participants for these conversations to get their profile details
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          user_id,
          profiles (
            id,
            full_name,
            role,
            company_data,
            student_data
          )
        `)
        .in('conversation_id', conversationIds);

      if (allParticipantsError) throw allParticipantsError;

      // Map participant data for easy lookup
      const participantsMap = new Map();
      allParticipants.forEach(p => {
        if (!participantsMap.has(p.conversation_id)) {
          participantsMap.set(p.conversation_id, []);
        }
        participantsMap.get(p.conversation_id).push(p.profiles);
      });

      // Step 4: Combine all data to form the final conversation summaries
      const conversations = conversationsWithLastMessage.map(convo => {
        const participantInfo = participantData.find(p => p.conversation_id === convo.id);
        const lastMessage = convo.messages[0]; // Assuming messages are ordered desc by created_at in the select
        const allConvoParticipants = participantsMap.get(convo.id) || [];

        // Determine the 'other' participant for display purposes (for 2-person chats)
        const otherParticipant = allConvoParticipants.find(p => p.id !== userId);
        const displayName = otherParticipant
          ? (otherParticipant.role === 'company_admin' ? otherParticipant.company_data?.company_name || otherParticipant.full_name : otherParticipant.full_name)
          : 'Unknown User'; // Handle multi-party or missing participant details

        return {
          id: convo.id,
          lastMessage: lastMessage ? lastMessage.content : 'No messages yet.',
          lastMessageDate: lastMessage ? lastMessage.created_at : convo.created_at, // Fallback to convo creation date
          unreadCount: participantInfo ? participantInfo.unread_count : 0,
          participants: allConvoParticipants, // Full participant list for multi-party
          displayParticipantName: displayName, // Simplified name for list display
          otherParticipantId: otherParticipant ? otherParticipant.id : null,
        };
      });

      return conversations;

    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Fetches all messages for a specific conversation.
   * @param {string} conversationId The ID of the conversation.
   * @returns {Array} An array of message objects.
   */
  async fetchMessages(conversationId) { // Renamed from getMessages to match user's page code
    if (!conversationId) {
      console.error("fetchMessages: Conversation ID is required.");
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
            id,
            conversation_id,
            sender_id,
            content,
            created_at
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true }); // Order chronologically

      if (error) throw error;

      return data.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        content: msg.content,
        timestamp: msg.created_at,
      }));

    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Sends a new message in a conversation.
   * @param {Object} messageData - Object containing conversation_id, sender_id, sender_role, content.
   * @returns {Object} The newly created message object.
   */
  async sendMessage({ conversation_id, sender_id, sender_role, content }) { // Destructured parameters to match user's code
    if (!conversation_id || !sender_id || !content) {
      console.error("sendMessage: Missing required parameters.");
      throw new Error("Missing message parameters.");
    }

    try {
      // Insert the new message
      const { data: newMessage, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation_id,
          sender_id: sender_id,
          content: content,
        })
        .select(`
            id,
            conversation_id,
            sender_id,
            content,
            created_at
        `) // Select the inserted data
        .single(); // Expecting one record back

      if (messageError) throw messageError;

      // Update last_message_at in the conversations table
      const { error: convoUpdateError } = await supabase
        .from('conversations')
        .update({ last_message_at: newMessage.created_at })
        .eq('id', conversation_id);

      if (convoUpdateError) console.error('Error updating conversation last_message_at:', convoUpdateError);

      // Increment unread_count for all *other* participants in conversation_participants
      // This requires a RLS policy allowing users to update unread_count for others in their conversations
      const { error: unreadUpdateError } = await supabase.rpc('increment_unread_counts_for_conversation', {
          p_conversation_id: conversation_id,
          p_sender_id: sender_id
      });
      // Remember to create this SQL function in Supabase if you haven't:
      /*
      CREATE OR REPLACE FUNCTION increment_unread_counts_for_conversation(p_conversation_id uuid, p_sender_id uuid)
      RETURNS void AS $$
      BEGIN
        UPDATE public.conversation_participants
        SET unread_count = unread_count + 1
        WHERE conversation_id = p_conversation_id AND user_id != p_sender_id;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      -- Grant usage to authenticated users
      GRANT EXECUTE ON FUNCTION public.increment_unread_counts_for_conversation(uuid, uuid) TO authenticated;
      */

      if (unreadUpdateError) console.error('Error incrementing unread counts:', unreadUpdateError);

      // Map data to match frontend expectations
      return {
        id: newMessage.id,
        conversationId: newMessage.conversation_id,
        senderId: newMessage.sender_id,
        content: newMessage.content,
        timestamp: newMessage.created_at,
      };

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Marks a conversation as read for a specific user.
   * Sets unread_count to 0 and updates last_read_at for that participant.
   * @param {string} conversationId The ID of the conversation.
   * @param {string} userId The ID of the user marking as read.
   */
  async markConversationAsRead(conversationId, userId) {
    if (!conversationId || !userId) {
      console.error("markConversationAsRead: Missing required parameters.");
      return;
    }

    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({
          unread_count: 0,
          last_read_at: new Date().toISOString(),
          // last_read_message_id could also be updated here to the ID of the latest message
        })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;
      console.log(`Conversation ${conversationId} marked as read for user ${userId}`);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  },

  /**
   * Subscribes to new messages for a given conversation.
   * @param {string} conversationId The ID of the conversation to subscribe to.
   * @param {function} callback A function to call with the new message data.
   * @returns {object} The Supabase subscription object.
   */
  subscribeToMessages(conversationId, callback) {
    console.log(`Subscribing to messages for conversation: ${conversationId}`);
    const subscription = supabase
      .channel(`conversation_${conversationId}`) // Use a unique channel name per conversation
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          console.log('New message received (real-time):', payload.new);
          // Map payload to match the message object structure used in the app
          const newMessage = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            senderId: payload.new.sender_id,
            content: payload.new.content,
            timestamp: payload.new.created_at,
          };
          callback(newMessage);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to conversation ${conversationId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to conversation ${conversationId}`);
        }
      });

    return subscription;
  },

  /**
   * Finds an existing conversation between two users or creates a new one.
   * Assumes a two-party conversation for simplicity.
   * @param {string} userId1 The ID of the first participant.
   * @param {string} userId2 The ID of the second participant.
   * @returns {string} The ID of the conversation.
   */
  async getOrCreateConversation(userId1, userId2) {
    if (!userId1 || !userId2) {
      throw new Error("getOrCreateConversation: Both user IDs are required.");
    }

    try {
      // Find existing conversation where both users are participants
      const { data: existingConvos, error: searchError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .in('user_id', [userId1, userId2])
        .having('count(conversation_id) = 2') // Ensure both are participants
        .groupBy('conversation_id');

      if (searchError) throw searchError;

      if (existingConvos && existingConvos.length > 0) {
        // Assuming unique 2-party conversations, return the first one found
        return existingConvos[0].conversation_id;
      }

      // If no conversation found, create a new one
      const { data: newConvo, error: createConvoError } = await supabase
        .from('conversations')
        .insert({}) // Insert an empty conversation row
        .select('id')
        .single();

      if (createConvoError) throw createConvoError;

      const conversationId = newConvo.id;

      // Add participants to the conversation_participants table
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversationId, user_id: userId1 },
          { conversation_id: conversationId, user_id: userId2 }
        ]);

      if (participantsError) throw participantsError;

      return conversationId;

    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw error;
    }
  },
};

export default messageService;