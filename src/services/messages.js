// src/services/messages.js
// Messaging API using Supabase JS client
import { supabase } from './supabaseClient';

// Send a new message
export async function sendMessage({ conversation_id, sender_id, sender_role, content }) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id, sender_id, sender_role, content }]);
  if (error) throw error;
  return data;
}

// Fetch all messages in a conversation
export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

// Create a new conversation (direct or group)
export async function createConversation({ name, type = 'direct', participantIdsWithRoles }) {
  // 1. Create the conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert([{ name, type }])
    .select()
    .single();
  if (convError) throw convError;

  // 2. Add participants
  const participants = participantIdsWithRoles.map(({ user_id, user_role }) => ({
    conversation_id: conversation.id,
    user_id,
    user_role
  }));
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert(participants);
  if (partError) throw partError;

  return conversation;
}

// Fetch all conversations for a user
export async function fetchConversations(userId) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id, conversations (id, name, type, created_at)')
    .eq('user_id', userId);
  if (error) throw error;
  // Flatten and return conversation details
  return data.map(row => row.conversations);
}

// Subscribe to new messages in a conversation (real-time)
export function subscribeToMessages(conversationId, callback) {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      payload => {
        callback(payload.new);
      }
    )
    .subscribe();
}
