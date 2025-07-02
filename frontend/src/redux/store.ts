import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { rootSaga } from '@/redux/sagas/root.saga';
import { useSelector, TypedUseSelectorHook } from 'react-redux';

import rootReducer from './features/root.reducer';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  // reducer: {
  //   counter: counterReducer,
  //   customizer: persistReducer<any>(persistConfig, CustomizerReducer),
  //   ecommerceReducer: EcommerceReducer,
  //   chatReducer: ChatsReducer,
  //   emailReducer: EmailReducer,
  //   notesReducer: NotesReducer,
  //   contactsReducer: ContactsReducer,
  //   ticketReducer: TicketReducer,
  //   userpostsReducer: UserProfileReducer,
  //   blogReducer: BlogReducer,
  //   authState: authReducer,
  // },
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
