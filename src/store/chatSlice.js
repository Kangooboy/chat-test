import { createSlice } from "@reduxjs/toolkit";
import { isMobile } from 'react-device-detect';

const initialState = {
  users: [],
  messages: [],
  currentUserId: '',
  isMobileView: isMobile,
  isShowChatWindowOnly: false
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
      setUsers(state, action) {
        state.users = action.payload;
      },
      setMessages(state, action) {
        state.messages = action.payload;
      },
      setCurrentUserId(state, action) {
        state.currentUserId = action.payload;
      },
      setShowChatWindowOnly(state, action) {
        state.isShowChatWindowOnly = action.payload;
      }
  }
});

export const {setUsers, setMessages, setCurrentUserId, setShowChatWindowOnly} = chatSlice.actions;

export default chatSlice.reducer;
