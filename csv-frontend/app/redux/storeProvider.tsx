"use client";
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { addToken } from './reducers/authSlice';
import { AppStore, makeStore } from './store';
const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);
  useEffect(() => {
    let newObject :any = localStorage.getItem("user");
    if (storeRef.current) {
      storeRef.current.dispatch(addToken(JSON.parse(newObject)))
    }
  }, [])
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    //for storing default value in store
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;