import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from './saga';

/**
 * Creates a Redux-Saga middleware instance.
 * Redux-Saga middleware is used to handle side effects like asynchronous actions within Redux.
 */
const sagaMiddleware = createSagaMiddleware();

/**
 * The store is configured with a single reducer for `categories`, provided by the `categorySlice`.
 */
const store = configureStore({
  reducer: {
    // Registering the category reducer under the key 'categories'
    categories: categoryReducer,
  },
  // Adding Saga middleware to the default set of middleware.
  // The `getDefaultMiddleware` function is used to get the default middleware, which is necessary for saga.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

export default store;