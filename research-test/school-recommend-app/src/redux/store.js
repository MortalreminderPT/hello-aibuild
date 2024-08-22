import { configureStore } from '@reduxjs/toolkit';
import schoolReducer from './schoolSlice';
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from './saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    school: schoolReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

export default store;