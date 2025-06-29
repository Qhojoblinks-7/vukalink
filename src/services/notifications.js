// src/services/notifications.js
import { supabase } from './supabaseClient';

// Fetch notifications for a user
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Mark a notification as read
export async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

// Create a notification
export async function createNotification({ user_id, type, message, link }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id, type, message, link }]);
  if (error) throw error;
  return data;
}
