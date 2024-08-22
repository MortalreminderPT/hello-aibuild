import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchSchoolSuccess, fetchSchoolFailure } from './schoolSlice';

function* fetchSchoolSaga(action) {
  try {
    const { lat, lon, num_student, atar, icsea, order } = action.payload;
    const queryParams = new URLSearchParams({
      lat,
      lon,
      num_student,
      atar,
      icsea,
      order
    }).toString();

    const response = yield call(fetch, `http://localhost:5000/recommendations?${queryParams}`);
    const data = yield response.json();
    yield put(fetchSchoolSuccess(data));
  } catch (error) {
    yield put(fetchSchoolFailure(error.toString()));
  }
}

export function* rootSaga() {
  yield takeLatest('FETCH_SCHOOL_SAGA', fetchSchoolSaga);
}