// src/pages/CompanyMessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import DesktopMessagesLayout from '../../../components/shared/DesktopMessagesLayout';
import MobileMessagesLayout from '../../../components/shared/MobileMessagesLayout';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  subscribeToMessages,
} from '../../../services/messages';

const CompanyMessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      fetchConversations(user.id)
        .then(setConversations)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedConversationId) {
      setLoading(true);
      fetchMessages(selectedConversationId)
        .then(setMessages)
        .catch(setError)
        .finally(() => setLoading(false));
      // Subscribe to real-time updates
      if (subscription) {
        subscription.unsubscribe();
      }
      const sub = subscribeToMessages(selectedConversationId, (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
      setSubscription(sub);
      return () => sub.unsubscribe();
    }
     
  }, [selectedConversationId, subscription]);

  const handleSendMessage = async (text) => {
    if (!selectedConversationId) return;
    try {
      await sendMessage({
        conversation_id: selectedConversationId,
        sender_id: user.id,
        sender_role: user.role,
        content: text,
      });
    } catch (err) {
      setError(err);
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
    <div className="bg-gray-100     min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopMessagesLayout
          conversations={conversations}
          selectedConversation={getSelectedConversation()}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          currentUserId={user.id}
          isCompany={user.role === 'company'}
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
          isCompany={user.role === 'company'}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default CompanyMessagesPage;
