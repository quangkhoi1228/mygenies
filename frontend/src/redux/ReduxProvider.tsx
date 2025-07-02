'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { store } from './store';

export const ReduxProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    {children}
    {/* </PersistGate> */}
  </Provider>
);
