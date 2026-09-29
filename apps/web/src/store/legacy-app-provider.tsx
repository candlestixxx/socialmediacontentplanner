"use client";
import { useReducer, type ReactNode } from 'react';
import { AppContext } from './context';
import { defaultState } from './types';
import { appReducer } from './reducer';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, defaultState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};