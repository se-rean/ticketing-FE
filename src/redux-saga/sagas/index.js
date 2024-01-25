/* eslint-disable max-len */
/* eslint-disable require-yield */
/* eslint-disable no-unused-vars */

import {
  all,
  put,
  takeEvery
} from 'redux-saga/effects';

import {
  appendRequest,
  appendSuccess,
  appendFailed,
  LOGIN
} from '../action-types';

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

export default function* rootSaga() {
  yield all([
    watchLoginSuccess()
  ]);
}
