import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from './saga';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

export default store;