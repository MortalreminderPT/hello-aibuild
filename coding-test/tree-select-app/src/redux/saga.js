import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchCategoriesSuccess, fetchCategoriesFailure } from './categorySlice';

function* fetchCategoriesSaga() {
  try {
    const response = yield call(fetch, 'http://localhost:8080/categories');
    const data = yield response.json();
    yield put(fetchCategoriesSuccess(data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.toString()));
  }
}

export function* rootSaga() {
  yield takeLatest('FETCH_CATEGORIES_SAGA', fetchCategoriesSaga);
}