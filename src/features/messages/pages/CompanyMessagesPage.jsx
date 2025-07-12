// src/pages/CompanyMessagesPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useAuth } from '../../../hooks/useAuth';
import DesktopMessagesLayout from '../../../components/shared/DesktopMessagesLayout';
import MobileMessagesLayout from '../../../components/shared/MobileMessagesLayout';
import { messageService } from '../../../services'; // Use messageService from services index

const CompanyMessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentSubscriptionRef = useRef(null); // Use a ref to manage subscription

  // Fetch conversations on component mount or user change
  useEffect(() => {
    if (!authLoading && user?.id) { // Ensure user.id is available
      setLoading(true);
      messageService.fetchConversations(user.id) // Use the service
        .then(setConversations)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  // Fetch messages and subscribe to real-time updates when selected conversation changes
  useEffect(() => {
    if (selectedConversationId && user?.id) { // Ensure user.id is available for marking as read
      setLoading(true);
      messageService.fetchMessages(selectedConversationId) // Use the service
        .then(setMessages)
        .catch(setError)
        .finally(() => setLoading(false));

      // Unsubscribe from previous channel if any
      if (currentSubscriptionRef.current) {
        currentSubscriptionRef.current.unsubscribe();
        currentSubscriptionRef.current = null;
      }

      // Subscribe to real-time updates for the new conversation
      const sub = messageService.subscribeToMessages(selectedConversationId, (newMsg) => { // Use the service
        setMessages((prev) => [...prev, newMsg]);
      });
      currentSubscriptionRef.current = sub; // Store subscription in ref

      // Mark conversation as read when it's opened/viewed
      messageService.markConversationAsRead(selectedConversationId, user.id)
        .then(() => {
          // Optimistically update the unread count in conversations state
          setConversations(prevConvos =>
            prevConvos.map(conv =>
              conv.id === selectedConversationId ? { ...conv, unreadCount: 0 } : conv
            )
          );
        })
        .catch(err => console.error("Failed to mark conversation as read:", err));


      // Cleanup subscription on component unmount or conversation change
      return () => {
        if (currentSubscriptionRef.current) {
          currentSubscriptionRef.current.unsubscribe();
          currentSubscriptionRef.current = null;
        }
      };
    }
     // No dependency on 'subscription' state variable, use ref instead
  }, [selectedConversationId, user?.id]);


  const handleSendMessage = async (text) => {
    if (!selectedConversationId || !user?.id || !text.trim()) return; // Added text.trim() check
    try {
      // Optimistically add the message
      setMessages(prev => [...prev, {
        id: 'temp-' + Date.now(), // Temporary ID
        conversationId: selectedConversationId,
        senderId: user.id,
        content: text.trim(),
        timestamp: new Date().toISOString(),
      }]);

      await messageService.sendMessage({ // Use the service
        conversation_id: selectedConversationId,
        sender_id: user.id,
        sender_role: user.role, // Pass user.role
        content: text.trim(),
      });
    } catch (err) {
      setError(err);
      // You might want to revert the optimistic update or show an error state for the message
    }
  };

  const getSelectedConversation = () => {
    return conversations.find(conv => conv.id === selectedConversationId);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
        Loading Messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
        {`Error: ${error.message}`}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopMessagesLayout
          conversations={conversations}
          selectedConversation={getSelectedConversation()}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          currentUserId={user.id}
          isCompany={user.role === 'company_admin'} // Correctly derive isCompany from user.role
          messages={messages}
        />
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col">
        <MobileMessagesLayout
          conversations={conversations}
          selectedConversation={getSelectedConversation()}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          currentUserId={user.id}
          isCompany={user.role === 'company_admin'} // Correctly derive isCompany from user.role
          messages={messages}
        />
      </div>
    </div>
  );
};

export default CompanyMessagesPage;