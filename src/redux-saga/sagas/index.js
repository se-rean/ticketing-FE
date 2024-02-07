/* eslint-disable max-len */
/* eslint-disable require-yield */
/* eslint-disable no-unused-vars */

import {
  all,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';

import {
  appendRequest,
  appendSuccess,
  appendFailed,
  LOGIN,
  GET_PARTICIPANTS,
  CREATE_EVENT,
  GET_PERFORMANCE_DETAILS,
  CREATE_PARTICIPANTS_BARCODE,
  GET_EVENTS
} from '../action-types';

import {
  getParticipantsAction,
  getPerformanceDetailsAction,
  setEventsAction,
  setParticipantsDataAction,
  setPerformanceDetailsAction
} from '../actions';

function* watchLoginSuccess() {
  yield takeEvery(appendSuccess(LOGIN), function* fn({ payload: { data: response } }) {
    const {
      data,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      },
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      sessionStorage.clear();
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('user', JSON.stringify(data));
      window.location.replace('/admin');
    }
  });
}

function* watchGetParticipantsSuccess() {
  yield takeEvery([ appendSuccess(GET_PARTICIPANTS) ], function* fn({ payload: { data: response } }) {
    const { is_success: isSuccess, data } = response;

    if (isSuccess) {
      const mappedData = data.map(i => ({
        ...i,
        fullName: `${i.firstname} ${i.lastname}`
      }));

      yield put(setParticipantsDataAction(mappedData));
    }
  });
}

function* getPerformanceDetailsSuccess() {
  yield takeEvery(appendSuccess(GET_PERFORMANCE_DETAILS), function* fn({ payload: { data: response } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      yield put(setPerformanceDetailsAction(data));
    }
  });
}

function* getEventsSuccess() {
  yield takeEvery(appendSuccess(GET_EVENTS), function* fn({ payload: { data: response } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      yield put(setEventsAction(data));
    }
  });
}

export default function* rootSaga() {
  yield all([
    watchLoginSuccess(),
    watchGetParticipantsSuccess(),
    getPerformanceDetailsSuccess(),
    getEventsSuccess()
  ]);
}
