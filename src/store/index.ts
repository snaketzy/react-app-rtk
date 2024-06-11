import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import commonSlice from './counter/commonSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    common: commonSlice
  }
})