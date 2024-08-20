import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchCategoriesSuccess, fetchCategoriesFailure } from './categorySlice';

/**
 *
 * A generator function that handles the side effects of fetching categories from the server.
 * This saga listens for the 'FETCH_CATEGORIES_SAGA' action and performs the following steps:
 * 1. Calls the `fetch` API to request the list of categories from the specified URL.
 * 2. If the fetch is successful, it parses the JSON response and dispatches the `fetchCategoriesSuccess` action with the fetched data.
 * 3. If the fetch fails (e.g., network error), it catches the error and dispatches the `fetchCategoriesFailure` action with the error message.
 *
 */
function* fetchCategoriesSaga() {
  try {
    const response = yield call(fetch, 'http://localhost:8080/categories');
    const data = yield response.json();
    // Dispatch success action with the fetched categories data
    yield put(fetchCategoriesSuccess(data));
  } catch (error) {
    // Dispatch failure action with the error message if the fetch fails
    yield put(fetchCategoriesFailure(error.toString()));
  }
}

/**
 *
 * A generator function that watches for the 'FETCH_CATEGORIES_SAGA' action.
 * When this action is dispatched, it triggers the `fetchCategoriesSaga` to handle the fetch operation.
 * `takeLatest` ensures that only the latest action is handled, and any previous pending `fetchCategoriesSaga`
 * will be canceled if a new 'FETCH_CATEGORIES_SAGA' action is dispatched before the previous one completes.
 *
 */
export function* rootSaga() {
  yield takeLatest('FETCH_CATEGORIES_SAGA', fetchCategoriesSaga);
}