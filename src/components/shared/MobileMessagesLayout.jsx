// src/components/shared/MobileMessagesLayout.jsx
import React, { useState } from 'react';
import MobileBottomNav from '../../features/dashboard/MobileBottomNav';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Button from '../ui/Button';
import { ArrowLeftIcon, BellIcon, MagnifyingGlassIcon, Bars3Icon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'; // For icons
import { useNavigate } from 'react-router-dom';

const MobileMessagesLayout = ({ conversations, selectedConversation, onSelectConversation, onSendMessage, currentUserId, isCompany }) => {
  const navigate = useNavigate();

  // State to control which view is active: list or conversation detail
  const [showConversationDetail, setShowConversationDetail] = useState(false);

  const handleSelectConversation = (conversationId) => {
    onSelectConversation(conversationId);
    setShowConversationDetail(true);
  };

  const handleBackToList = () => {
    setShowConversationDetail(false);
    onSelectConversation(null); // Deselect conversation
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900   py-4 px-4 flex justify-between items-center shadow-md">
        {showConversationDetail ? (
          <button onClick={handleBackToList} className="text-white hover:text-blue-400">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        ) : (
          // No back button on the main messages list
          <div className="w-6 h-6"></div> // Placeholder for alignment
        )}
        <span className="text-white text-lg font-semibold truncate max-w-[calc(100%-120px)]">
          {showConversationDetail && selectedConversation ? selectedConversation.participant.name : 'Messages'}
        </span>
        <div className="flex items-center space-x-4">
          {!showConversationDetail && (
            <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-400" />
          )}
          {showConversationDetail && (
            // Icons for conversation details view (though mobile design doesn't explicitly show them)
            <>
              <Bars3Icon className="h-6 w-6 text-white cursor-pointer hover:text-blue-400" />
              <EllipsisVerticalIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-400" />
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        {!showConversationDetail ? (
          // Mobile Conversation List View
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-grey-600 -900">Messages</h2>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-full">
                + New Message
              </Button>
            </div>
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-vuka-blue"
              />
            </div>
            <ConversationList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id} // Always null when showConversationDetail is false
            />
          </>
        ) : (
          // Mobile Conversation Detail View
          selectedConversation ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 bg-gray-100     p-4 rounded-lg">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isSender={message.senderId === currentUserId}
                    profileImage={message.isStudent ? selectedConversation.participant.profileImage : message.profileImage}
                  />
                ))}
              </div>
              <div className="mt-4">
                <MessageInput onSendMessage={onSendMessage} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center text-grey-600 -600 0">
              Error: No conversation selected.
            </div>
          )
        )}
      </div>
      <MobileBottomNav isCompany={isCompany} />
    </div>
  );
};

export default MobileMessagesLayout;