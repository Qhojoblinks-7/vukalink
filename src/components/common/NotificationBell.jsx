// src/components/common/NotificationBell.jsx
import { BellIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    };
    fetchNotifications();
  }, [user, open]);

  const handleOpen = async () => {
    setOpen(!open);
    // Mark all as read when opening
    if (!open && unreadCount > 0) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative">
        <BellIcon className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <ul>
            {notifications.length === 0 && <li className="p-4 text-gray-500">No notifications</li>}
            {notifications.map(n => (
              <li key={n.id} className={`p-4 border-b ${n.is_read ? '' : 'bg-gray-100'}`}>
                {n.content}
                <span className="block text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default NotificationBell;
