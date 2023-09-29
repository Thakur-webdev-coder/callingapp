import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingEnable: false,
  chatMessage: [],
  chatRoom: "",
  kokoaContacts:[]
};

const sliceReducer = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changeLoadingStatus: (state, action) => {
      state.isLoadingEnable = action.payload;
    },
    saveLoginDetails: (state, action) => {
      console.log("action.payload=====>>", action.payload);
    
      state.loginDetails = action.payload;
    },
    saveEncrLoginDetails: (state, action) => {
      state.encrypt_detail = action.payload;
    },
    saveBalanceData: (state, action) => {
      console.log("action.payload=====>>", action.payload);
      state.balanceDetail = action.payload;
    },
    saveContacts: (state, action) => {
      state.allContacts = action.payload;
    },
    saveKokoaContacts: (state, action) => {
      state.kokoaContacts = action.payload;
    },
    saveNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },

    // chat

    setChatMessage: (state, action) => {
      console.log("action.payload=====>>", action.payload);
      state.chatMessage = action.payload;
    },
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload
      console.log('save------',state.saveStatus);
    },

    setChatRoom: (state, action) => {
      state.chatRoom = action?.payload ?? "";
    },
  },
});

export const {
  changeLoadingStatus,
  saveLoginDetails,
  saveEncrLoginDetails,
  saveBalanceData,
  //chat
  setChatMessage,
  setChatRoom,
  saveContacts,
  saveKokoaContacts,
  saveNotificationData,
  setSaveStatus
} = sliceReducer.actions;
export default sliceReducer.reducer;
