import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingEnable: false,
  chatMessage: [],
  chatRoom: '',


};

const sliceReducer = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changeLoadingStatus: (state, action) => {
      state.isLoadingEnable = action.payload;
    },
    saveLoginDetails: (state, action) => {
      console.log("dataaa", action.payload);
      console.log("action.payload======>>>", action.payload);

      state.loginDetails = action.payload;
    },
    saveEncrLoginDetails: (state, action) => {
      // console.log("action.payload======>>>", action.payload);
      state.encrypt_detail = action.payload;
    },
    saveBalanceData: (state, action) => {
      state.balanceDetail = action.payload;
    },

    // chat

    setChatMessage: (state, action) => {
      console.log('action.payload=====>>', action.payload);
      state.chatMessage = action.payload;
    },

    setChatRoom: (state, action) => {
      state.chatRoom = action?.payload ?? '';
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
  setChatRoom
} = sliceReducer.actions;
export default sliceReducer.reducer;
