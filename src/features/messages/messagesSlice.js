// src/features/messages/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../services/messageService'; // Import the new service
import { supabase } from '../../services/supabaseClient'; // Import for real-time (optional for now)

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  status: 'idle',
  error: null,
  sendMessageStatus: 'idle',
  sendMessageError: null,
  unreadCount: 0,
};

// --- Async Thunks ---

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (userId, { rejectWithValue }) => { // Pass userId to the thunk
    try {
      const data = await messageService.getConversations(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await messageService.getMessages(conversationId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, senderId, content }, { rejectWithValue }) => { // Now also takes senderId
    try {
      const newMessage = await messageService.sendMessage(conversationId, senderId, content);
      return newMessage;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  'messages/markConversationAsRead',
  async ({ conversationId, userId }, { rejectWithValue }) => { // Pass userId here
    try {
      await messageService.markConversationAsRead(conversationId, userId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

// --- Messages Slice ---
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
      state.messages = [];
      state.error = null;
      state.status = 'idle';
    },
    addMessageLocally: (state, action) => {
        // Ensure payload has conversationId, senderId, content, timestamp
        if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
            state.messages.push(action.payload);
        }

        const convIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
        if (convIndex !== -1) {
            state.conversations[convIndex].lastMessage = action.payload.content;
            state.conversations[convIndex].lastMessageDate = action.payload.timestamp;
            // Note: incrementing unreadCount here is primarily for real-time incoming messages from *others*.
            // The backend RPC handles increments for other users.
            // You'd typically only increment if action.payload.senderId !== currentUserId
            // and if the current user is NOT viewing this conversation.
            // For simplicity, leave as is, and rely on `fetchConversations` for accurate counts.
        }
    },
    clearMessagesError: (state) => {
      state.error = null;
      state.sendMessageError = null;
    },
    resetConversationUnreadCount: (state, action) => {
        const conversation = state.conversations.find(c => c.id === action.payload);
        if (conversation && conversation.unreadCount > 0) {
            state.unreadCount -= conversation.unreadCount;
            conversation.unreadCount = 0;
            if (state.unreadCount < 0) state.unreadCount = 0;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchConversations ---
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
        state.unreadCount = action.payload.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.conversations = [];
        state.unreadCount = 0;
      })
      // --- fetchMessages ---
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.messages = [];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.messages = [];
      })
      // --- sendMessage ---
      .addCase(sendMessage.pending, (state) => {
        state.sendMessageStatus = 'loading';
        state.sendMessageError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendMessageStatus = 'succeeded';
        state.messages.push(action.payload);
        const convIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = action.payload.content;
          state.conversations[convIndex].lastMessageDate = action.payload.timestamp;
          state.conversations[convIndex].unreadCount = 0; // Sender's own unread count for this convo becomes 0
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessageStatus = 'failed';
        state.sendMessageError = action.payload;
      })
      // --- markConversationAsRead ---
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        const convIndex = state.conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1 && state.conversations[convIndex].unreadCount > 0) {
            state.unreadCount -= state.conversations[convIndex].unreadCount;
            state.conversations[convIndex].unreadCount = 0;
            if (state.unreadCount < 0) state.unreadCount = 0;
        }
      });
  },
});

export const {
  setCurrentConversation,
  addMessageLocally,
  clearMessagesError,
  resetConversationUnreadCount,
} = messagesSlice.actions;

export default messagesSlice.reducer;