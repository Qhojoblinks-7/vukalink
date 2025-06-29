// src/components/shared/MessageInput.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import { PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from '@heroicons/react/24/solid'; // For send icon
import { uploadFile, getPublicUrl } from '../../services/upload';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSend = async () => {
    let attachmentUrl = null;
    if (attachment && attachment.file) {
      setUploading(true);
      try {
        const filePath = `messages/${Date.now()}_${attachment.file.name}`;
        await uploadFile('message-attachments', filePath, attachment.file);
        attachmentUrl = getPublicUrl('message-attachments', filePath);
      } catch (e) {
        alert('Attachment upload failed!');
      } finally {
        setUploading(false);
      }
    }
    if (message.trim() || attachmentUrl) {
      onSendMessage(message.trim(), attachmentUrl);
      setMessage('');
      setAttachment(null);
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({
        file,
        fileName: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-inner border border-gray-200">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-vuka-blue"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleAttachmentChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer text-vuka-medium-grey hover:text-vuka-blue">
        <PaperClipIcon className="h-6 w-6" />
      </label>
      {/* You can add a PhotoIcon for image uploads if needed, similar to PaperClipIcon */}
      {/* <PhotoIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-vuka-blue" /> */}

      <Button
        className="bg-vuka-orange hover:bg-vuka-orange-dark text-white p-2 rounded-full flex items-center justify-center"
        onClick={handleSend}
        disabled={(!message.trim() && !attachment) || uploading}
      >
        {uploading ? 'Uploading...' : <PaperAirplaneIcon className="h-5 w-5 rotate-90" />}
      </Button>
    </div>
  );
};

export default MessageInput;