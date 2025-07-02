// src/services/notificationService.js
import { supabase } from '../services/supabaseClient';

export const notificationService = {
  /**
   * Fetches all notifications for the current authenticated user.
   * RLS ensures only the user's notifications are returned.
   */
  async getMyNotifications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to get notifications.");
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id) // For safety, RLS handles this
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching my notifications: ${error.message}`);
    }
    return data;
  },

  /**
   * Marks a specific notification as read.
   * RLS ensures only the user can mark their own as read.
   */
  async markNotificationAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      throw new Error(`Error marking notification ${notificationId} as read: ${error.message}`);
    }
    return true;
  },

  /**
   * Marks all unread notifications for the current user as read.
   * RLS ensures only the user can mark their own as read.
   */
  async markAllMyNotificationsAsRead() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to mark all notifications as read.");
    if (!user) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false); // Only update unread ones

    if (error) {
      throw new Error(`Error marking all notifications as read: ${error.message}`);
    }
    return true;
  },
};