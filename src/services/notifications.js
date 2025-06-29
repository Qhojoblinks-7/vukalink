// src/services/notifications.js
import { supabase } from './supabaseClient';
import { getUserOrganizationId } from './organization';

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

// Create a notification with org awareness
export async function createNotification({ user_id, type, message, link, userId }) {
  const organization_id = await getUserOrganizationId(userId);
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id, type, message, link, organization_id }]);
  if (error) throw error;
  return data;
}
