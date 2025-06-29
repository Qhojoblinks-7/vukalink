// src/pages/MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopMessagesLayout from '../components/shared/DesktopMessagesLayout';
import MobileMessagesLayout from '../components/shared/MobileMessagesLayout';
import { useAuth } from '../hooks/useAuth';

const MessagesPage = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for conversations and messages (simulating different users)
  // For a real app, this would come from an API based on user.id
  const dummyConversations = [
    {
      id: 'conv_1',
      participant: {
        id: 'user_1_student',
        name: 'Acme Corp',
        profileImage: '/images/acme_corp_logo.jpg', // Placeholder for company logo
        isCompany: true, // Indicates this participant is a company
      },
      lastMessage: 'Great, please send your CV!',
      lastMessageTime: '08:32',
      unread: true,
      messages: [
        {
          id: 'msg_1_1',
          senderId: 'user_2_company', // Assuming the current user is the company
          text: 'Good morning! I just submitted my application for the internship.',
          timestamp: 'Today 08:30',
          isStudent: true, // Assuming this message is from the student
          profileImage: '/images/student_1.jpg',
        },
        {
          id: 'msg_1_2',
          senderId: 'user_1_student',
          text: 'Great, please send your CV!',
          timestamp: '08:32',
          isStudent: false, // This message is from the company (current user)
          profileImage: '/images/acme_corp_logo.jpg',
          attachment: {
            fileName: 'JD_Resume.pdf',
            url: '/attachments/JD_Resume.pdf',
          },
        },
        {
          id: 'msg_1_3',
          senderId: 'user_2_company',
          text: 'Sure, attaching it now.',
          timestamp: '08:33',
          isStudent: true,
          profileImage: '/images/student_1.jpg',
          attachment: {
            fileName: 'MyCV.pdf',
            url: '/attachments/MyCV.pdf',
          },
        },
        {
          id: 'msg_1_4',
          senderId: 'user_1_student',
          text: 'Thanks for your interest. We will review your documents and get back soon!',
          timestamp: 'Yesterday 18:50',
          isStudent: false,
          profileImage: '/images/acme_corp_logo.jpg',
        },
      ],
    },
    {
      id: 'conv_2',
      participant: {
        id: 'user_3_student',
        name: 'GreenWorks Ltd', // Assuming this is a company interacting with a student
        profileImage: '/images/greenworks_logo.jpg', // Placeholder
        isCompany: true,
      },
      lastMessage: 'Let\'s schedule an interview next week.',
      lastMessageTime: 'Yesterday',
      unread: false,
      messages: [
        { id: 'msg_2_1', senderId: 'user_3_student', text: 'Hello, are you available for an interview?', timestamp: 'Yesterday 10:00', isStudent: true, profileImage: '/images/student_2.jpg', },
        { id: 'msg_2_2', senderId: 'user_2_company', text: 'Yes, I am. When would you like to schedule it?', timestamp: 'Yesterday 10:05', isStudent: false, profileImage: '/images/greenworks_logo.jpg', },
      ],
    },
    {
      id: 'conv_3',
      participant: {
        id: 'user_4_student',
        name: 'Urban Data Solutions', // Company messaging student
        profileImage: '/images/urban_data_logo.jpg', // Placeholder
        isCompany: true,
      },
      lastMessage: 'Thank you for your interest! Please send y',
      lastMessageTime: 'Mon',
      unread: false,
      messages: [
        { id: 'msg_3_1', senderId: 'user_4_student', text: 'We received your application. Can you send your portfolio?', timestamp: 'Mon 09:00', isStudent: true, profileImage: '/images/student_3.jpg', },
        { id: 'msg_3_2', senderId: 'user_2_company', text: 'Sure, I will send it by end of day.', timestamp: 'Mon 09:10', isStudent: false, profileImage: '/images/urban_data_logo.jpg', },
      ],
    },
    {
      id: 'conv_4',
      participant: {
        id: 'user_5_student',
        name: 'BrightFuture Labs',
        profileImage: '/images/brightfuture_labs_logo.jpg',
        isCompany: true,
      },
      lastMessage: 'Received your resume - thanks!',
      lastMessageTime: '1w ago',
      unread: false,
      messages: [
        { id: 'msg_4_1', senderId: 'user_5_student', text: 'Hi, I received your resume.', timestamp: '1w ago 14:00', isStudent: true, profileImage: '/images/student_4.jpg', },
        { id: 'msg_4_2', senderId: 'user_2_company', text: 'Thanks!', timestamp: '1w ago 14:05', isStudent: false, profileImage: '/images/brightfuture_labs_logo.jpg', },
      ],
    },
  ];

  // Placeholder for current user's ID to simulate sender
  // In a real app, this would come from `user.id` or a specific company ID.
  const currentUserId = user?.isCompany ? 'user_1_student' : 'user_2_company'; // Example: user_1_student is the company, user_2_company is a student applying. Adjust as per actual roles.

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call to fetch conversations
        setTimeout(() => {
          // In a real scenario, you'd filter conversations relevant to the logged-in user
          setConversations(dummyConversations);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchConversations();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError(new Error("You must be logged in to view messages."));
    }
  }, [user, authLoading]);

  const getSelectedConversation = () => {
    return conversations.find(conv => conv.id === selectedConversationId);
  };

  const handleSendMessage = (text, attachment = null) => {
    if (!selectedConversationId) return;

    // Simulate sending message (add to selected conversation)
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: `msg_${conv.id}_${conv.messages.length + 1}`,
                  senderId: currentUserId, // This should be the actual logged-in user's ID
                  text,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                  isStudent: !user?.isCompany, // If current user is company, then isStudent is false, else true
                  profileImage: user?.isCompany ? '/images/acme_corp_logo.jpg' : user?.profileImage, // Use actual user profile image
                  attachment,
                },
              ],
              lastMessage: text,
              lastMessageTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
          : conv
      )
    );
    // In a real app, you would make an API call here.
    console.log(`Message sent to ${selectedConversationId}: ${text}`);
  };


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Messages...
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        {authError ? `Authentication error: ${authError.message}` : `Error: ${error.message}`}
      </div>
    );
  }

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopMessagesLayout
          conversations={conversations}
          selectedConversation={getSelectedConversation()}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          currentUserId={currentUserId}
          isCompany={user?.isCompany || false} // Pass company status
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col">
        <MobileMessagesLayout
          conversations={conversations}
          selectedConversation={getSelectedConversation()}
          onSelectConversation={setSelectedConversationId}
          onSendMessage={handleSendMessage}
          currentUserId={currentUserId}
          isCompany={user?.isCompany || false} // Pass company status
        />
      </div>
    </div>
  );
};

export default MessagesPage;