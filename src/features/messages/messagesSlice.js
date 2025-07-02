// src/features/messages/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Assuming you'll create a dedicated messageService for API interactions
// import messageService from '../../services/messageService';
import api from '../../services/api'; // Reusing the general API instance for now

const initialState = {
  conversations: [], // List of conversation summaries (e.g., last message, participants, unread count)
  currentConversation: null, // The active conversation being viewed
  messages: [], // Messages for the currentConversation
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' - for main operations
  error: null,
  sendMessageStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' - for sending messages
  sendMessageError: null,
  unreadCount: 0, // Global unread message count
};

// --- Async Thunks ---

// Thunk to fetch all conversations for the authenticated user
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      // Assuming an API endpoint like /messages/conversations or /users/me/conversations
      const response = await api.get('/messages/conversations');
      return response.data; // Expecting an array of conversation objects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to fetch messages for a specific conversation
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      // Assuming an API endpoint like /messages/conversations/:conversationId/messages
      const response = await api.get(`/messages/conversations/${conversationId}/messages`);
      return response.data; // Expecting an array of message objects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to send a new message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      // Assuming an API endpoint like /messages/conversations/:conversationId/messages
      const response = await api.post(`/messages/conversations/${conversationId}/messages`, { content });
      return response.data; // Expecting the new message object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to mark a conversation as read (optional, adjust based on your backend)
export const markConversationAsRead = createAsyncThunk(
  'messages/markConversationAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      // Assuming a PUT/PATCH endpoint to update read status
      await api.patch(`/messages/conversations/${conversationId}/read`);
      return conversationId; // Return the ID of the conversation marked as read
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Messages Slice ---
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Synchronous reducers for local state updates
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
      // Optionally clear messages when switching conversation, they will be refetched
      state.messages = [];
      state.error = null;
      state.status = 'idle'; // Reset status when navigating
    },
    addMessageLocally: (state, action) => {
      // For optimistic updates or real-time message additions (e.g., from WebSockets)
      if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
        state.messages.push(action.payload);
      }
      // Update the last message and unread count in conversations list
      const convIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = action.payload.content;
        state.conversations[convIndex].lastMessageDate = action.payload.timestamp;
        // Increment unread count if the message is for another conversation or if not viewing it
        if (state.currentConversation.id !== action.payload.conversationId) {
            state.conversations[convIndex].unreadCount = (state.conversations[convIndex].unreadCount || 0) + 1;
            state.unreadCount++; // Increment global unread count
        }
      } else {
        // If it's a new conversation, you might want to fetch conversations again or add a stub
        // For simplicity, we'll assume it's for an existing conversation
      }
    },
    clearMessagesError: (state) => {
      state.error = null;
      state.sendMessageError = null;
    },
    // Reducer to update global unread count (e.g., after reading a conversation)
    decrementUnreadCount: (state, action) => {
        // Find conversation by ID and subtract its unread count from global total
        const conversation = state.conversations.find(c => c.id === action.payload);
        if (conversation && conversation.unreadCount) {
            state.unreadCount -= conversation.unreadCount;
            conversation.unreadCount = 0; // Reset conversation's unread count
            if (state.unreadCount < 0) state.unreadCount = 0; // Prevent negative
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
        // Calculate initial global unread count
        state.unreadCount = action.payload.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch conversations';
        state.conversations = [];
      })
      // --- fetchMessages ---
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading'; // Using main status for messages fetch
        state.error = null;
        state.messages = []; // Clear previous messages
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch messages';
        state.messages = [];
      })
      // --- sendMessage ---
      .addCase(sendMessage.pending, (state) => {
        state.sendMessageStatus = 'loading';
        state.sendMessageError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendMessageStatus = 'succeeded';
        // Add the newly sent message to the current messages list
        state.messages.push(action.payload);
        // Update the corresponding conversation in the list (last message, date)
        const convIndex = state.conversations.findIndex(c => c.id === action.payload.conversationId);
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = action.payload.content;
          state.conversations[convIndex].lastMessageDate = action.payload.timestamp;
          // When current user sends message, it's considered read by them
          state.conversations[convIndex].unreadCount = 0;
          // No change to global unread count here, as the sender doesn't have unread messages from self
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessageStatus = 'failed';
        state.sendMessageError = action.payload || 'Failed to send message';
      })
      // --- markConversationAsRead ---
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        const convIndex = state.conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1 && state.conversations[convIndex].unreadCount > 0) {
            state.unreadCount -= state.conversations[convIndex].unreadCount;
            state.conversations[convIndex].unreadCount = 0;
            if (state.unreadCount < 0) state.unreadCount = 0; // Prevent negative
        }
      });
  },
});

export const {
  setCurrentConversation,
  addMessageLocally,
  clearMessagesError,
  decrementUnreadCount, // Export this if you need to manually trigger unread count decrement
} = messagesSlice.actions;

export default messagesSlice.reducer;