import { createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'cookies-next';
export interface CounterState {
  user: any
}

const initialState: CounterState = {
  user: {},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeToken: (state:any) => {
      state.user = {};
      setCookie('utc', null);
    },

    addToken: (state:any, action: any) => {
      state.user = action.payload;
      setCookie('utc', state.user?.token);
    },
  },
})

// Action creators are generated for each case reducer function
export const { removeToken, addToken } = authSlice.actions

export default authSlice.reducer