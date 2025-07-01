// src/components/shared/DesktopMessagesLayout.jsx
import React from 'react';
import CompanyDashboardSidebar from '../../components/company/CompanyDashboardSidebar'; // Assuming this sidebar is generally useful
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Button from '../ui/Button';
import { MagnifyingGlassIcon, Bars3Icon, PhotoIcon, PaperClipIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'; // For icons

const DesktopMessagesLayout = ({ conversations, selectedConversation, onSelectConversation, onSendMessage, currentUserId, isCompany }) => {
  return (
    <div className="flex w-full min-h-screen">
      {isCompany && <CompanyDashboardSidebar />} {/* Conditionally render sidebar for company users */}
      <div className={`flex-1 flex bg-white   shadow-lg rounded-lg m-4 ${isCompany ? 'ml-0' : 'mx-auto max-w-7xl'}`}>
        {/* Left Pane: Conversation List */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-grey-600 -900">Messages</h2>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-full">
              + New Message
            </Button>
          </div>
          <div className="p-4 border-b border-gray-200 relative">
            <MagnifyingGlassIcon className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              onSelectConversation={onSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>
        </div>

        {/* Right Pane: Message Content */}
        <div className="flex-2 w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center">
                  {selectedConversation.participant.profileImage && (
                    <img
                      src={selectedConversation.participant.profileImage}
                      alt={selectedConversation.participant.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-grey-600 -900">{selectedConversation.participant.name}</h3>
                    <p className="text-sm text-grey-600 -600 0">{selectedConversation.participant.isCompany ? 'Company' : 'Student'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Icons as per design */}
                  <Bars3Icon className="h-6 w-6 text-grey-600 -600 0 cursor-pointer hover:text-blue-600" />
                  <EllipsisVerticalIcon className="h-6 w-6 text-grey-600 -600 0 cursor-pointer hover:text-blue-600" />
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100    ">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isSender={message.senderId === currentUserId}
                    profileImage={message.isStudent ? selectedConversation.participant.profileImage : message.profileImage}
                  />
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <MessageInput onSendMessage={onSendMessage} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center text-grey-600 -600 0">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopMessagesLayout;