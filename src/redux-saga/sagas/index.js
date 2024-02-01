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
  CREATE_PARTICIPANTS_BARCODE
} from '../action-types';

import {
  getParticipantsAction,
  getPerformanceDetailsAction,
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
      yield put(setParticipantsDataAction(data));
    }
  });
}

function* createEventSucess() {
  yield takeEvery(appendSuccess(CREATE_EVENT), function* fn({ payload: { data: response } }) {
    const { is_success: isSuccess, data: { performance_code: performanceCode } } = response;

    sessionStorage.setItem('performanceCode', performanceCode);

    if (isSuccess) {
      // yield put(getPerformanceDetailsAction(performanceCode));
      yield put(getPerformanceDetailsAction('PDUB01DEC2023B'));
    }
  });
}

function* createParticipantsBarcodeSuccess() {
  yield takeEvery(appendSuccess(CREATE_PARTICIPANTS_BARCODE), function* fn({ payload: { data: response } }) {
    const { is_success: isSuccess } = response;

    const table = yield select(state => state.table);

    if (isSuccess) {
      // yield put(getParticipantsAction({
      //   performanceCode: sessionStorage.getItem('performanceCode'),
      //   page: table.page + 1,
      //   pageSize: table.pageSize
      // }));

      yield put(getParticipantsAction({
        performanceCode: 'PDUB01DEC2023B',
        page: table.page + 1,
        pageSize: table.pageSize
      }));
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

export default function* rootSaga() {
  yield all([
    watchLoginSuccess(),
    watchGetParticipantsSuccess(),
    createEventSucess(),
    getPerformanceDetailsSuccess(),
    createParticipantsBarcodeSuccess()
  ]);
}
