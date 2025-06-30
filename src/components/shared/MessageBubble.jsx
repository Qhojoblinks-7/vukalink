// src/components/shared/MessageBubble.jsx
import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const MessageBubble = ({ message, isSender, profileImage }) => {
  const bubbleClasses = isSender
    ? 'bg-blue-600 text-white rounded-bl-lg rounded-t-lg self-end'
    : 'bg-white text-grey-600 -700 border border-gray-200 rounded-br-lg rounded-t-lg self-start';

  const containerClasses = isSender
    ? 'flex items-end justify-end'
    : 'flex items-end justify-start';

  return (
    <div className={`flex w-full ${containerClasses}`}>
      {!isSender && profileImage && (
        <img src={profileImage} alt="Profile" className="h-8 w-8 rounded-full object-cover mr-2" />
      )}
      <div className={`p-3 max-w-[70%] text-sm break-words ${bubbleClasses} shadow-sm`}>
        {message.text}
        {message.attachment && (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 underline mt-2 bg-white p-2 rounded-md shadow-sm"
            onClick={(e) => e.stopPropagation()} // Prevent bubble click
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            <span className="text-grey-600 -700">{message.attachment.fileName}</span>
          </a>
        )}
        <p className={`text-[0.65rem] mt-1 ${isSender ? 'text-blue-100' : 'text-grey-600 -600 0'} text-right`}>
          {message.timestamp}
        </p>
      </div>
      {isSender && profileImage && (
        <img src={profileImage} alt="Profile" className="h-8 w-8 rounded-full object-cover ml-2" />
      )}
    </div>
  );
};

export default MessageBubble;