

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingEnable: false,
}

 const sliceReducer = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeLoadingStatus: (state,action) => {
     state.isLoadingEnable=action.payload
    },
    saveLoginDetails:(state,action)=>{
      state.loginDetails=action.payload
    },
    saveEncrLoginDetails:(state,action)=>{
      console.log('action.payload======>>>',action.payload)
      state.encrypt_detail=action.payload
    },
    saveBalanceData:(state,action)=>{
      state.balanceDetail=action.payload
    }
    
  }
})

export const {changeLoadingStatus,saveLoginDetails,saveEncrLoginDetails,saveBalanceData} =sliceReducer.actions;
export default sliceReducer.reducer;
