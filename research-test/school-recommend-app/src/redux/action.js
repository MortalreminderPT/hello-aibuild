export const FETCH_SCHOOL_SAGA = 'FETCH_SCHOOL_SAGA';

export const fetchSchoolSaga = (params) => ({
  type: FETCH_SCHOOL_SAGA,
  payload: params,
});