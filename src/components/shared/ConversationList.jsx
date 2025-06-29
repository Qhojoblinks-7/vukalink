// src/components/shared/ConversationList.jsx
import React from 'react';

const ConversationList = ({ conversations, onSelectConversation, selectedConversationId }) => {
  return (
    <div className="space-y-2">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
              ${selectedConversationId === conv.id ? 'bg-vuka-blue-light' : 'hover:bg-gray-100'}
            `}
            onClick={() => onSelectConversation(conv.id)}
          >
            {conv.participant.profileImage && (
              <img
                src={conv.participant.profileImage}
                alt={conv.participant.name}
                className="h-12 w-12 rounded-full object-cover mr-3"
              />
            )}
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-vuka-strong truncate">{conv.participant.name}</p>
                <span className="text-xs text-vuka-medium-grey whitespace-nowrap">{conv.lastMessageTime}</span>
              </div>
              <p className="text-sm text-vuka-medium-grey truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread && (
              <span className="ml-2 h-2 w-2 bg-vuka-orange rounded-full flex-shrink-0"></span>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-vuka-medium-grey p-4">No conversations found.</p>
      )}
    </div>
  );
};

export default ConversationList;