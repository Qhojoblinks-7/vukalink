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
              ${selectedConversationId === conv.id ? 'bg-blue-100' : 'hover:bg-gray-100    '}
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
                <p className="font-semibold text-grey-600 -900 dark:text-grey-600 -600 truncate">{conv.participant.name}</p>
                <span className="text-xs text-grey-600 -600 0 whitespace-nowrap">{conv.lastMessageTime}</span>
              </div>
              <p className="text-sm text-grey-600 -600 0 truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread && (
              <span className="ml-2 h-2 w-2 bg-orange-400 rounded-full flex-shrink-0"></span>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-grey-600 -600 0 p-4">No conversations found.</p>
      )}
    </div>
  );
};

export default ConversationList;