import { configureStore } from '@reduxjs/toolkit';
import bets from './bets';
import ui from './ui';
import profile from './profile';

const allStores = {
  bets,
  ui,
  profile,
};

export const createStore = () =>
  configureStore(
    {
      reducer: allStores,
    },
    // @ts-expect-error redux
    typeof window !== 'undefined' &&
      // @ts-expect-error redux
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-expect-error redux
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
