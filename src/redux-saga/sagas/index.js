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
  appendSuccess,
  LOGIN,
  GET_PARTICIPANTS,
  GET_PERFORMANCE_DETAILS,
  CREATE_PARTICIPANTS_BARCODE,
  GET_EVENTS,
  REFUND_PARTICIPANTS,
  DELETE_PARTICIPANTS,
  UPDATE_PARTICIPANTS,
  GET_USERS,
  UPDATE_EVENTS
} from '../action-types';

import {
  setEventsAction,
  setParticipantsDataAction,
  setPerformanceDetailsAction,
  setUsersAction
} from '../actions';
import {
  toastError, toastSuccess
} from '../../helpers';
import { isEmpty } from 'lodash';

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
      window.location.replace('/admin/events');
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

function* refundParticipantsSuccess() {
  yield takeEvery(appendSuccess(REFUND_PARTICIPANTS), function* fn({ payload: { data: response } }) {
    const {
      is_success: isSuccess,
      errors
    } = response;

    if (!isSuccess) {
      toastError(errors);
    } else {
      toastSuccess('Refunded, Successfully!');
    }
  });
}

function* generateBarcodeSuccess() {
  yield takeEvery(appendSuccess(CREATE_PARTICIPANTS_BARCODE), function* fn({ payload: { data: response } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    const hasError = data[0]?.generate_barcode_api_respose;

    if (hasError) {
      toastError(hasError);
    } else {
      toastSuccess('Barcode Generated, Successfully!');
    }
  });
}

function* deleteParticipantsSuccess() {
  yield takeEvery(appendSuccess(DELETE_PARTICIPANTS), function* fn({ payload: { data: response } }) {
    const {
      errors,
      is_success: isSuccess
    } = response;

    if (isEmpty(errors)) {
      toastSuccess('Deleted, Successfully!');
    }
  });
}

function* updateParticipantsSuccess() {
  yield takeEvery(appendSuccess(UPDATE_PARTICIPANTS), function* fn({ payload: { data: response } }) {
    const {
      errors,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      toastSuccess('Updated, Successfully!');
    }
  });
}

function* getUsersSuccess() {
  yield takeEvery(appendSuccess(GET_USERS), function* fn({ payload: { data: response, config: { search: searchValue } } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      const user = JSON.parse(sessionStorage.getItem('user'));

      const mappedData = data.map(i => ({
        ...i, fullName: `${i.fname} ${i.mname} ${i.lname}`
      })).filter(i => i.id !== user.id && i.fullName.toLowerCase().includes(searchValue.toLowerCase()));

      yield put(setUsersAction(mappedData));
    }
  });
}

function* updateEventsSuccess() {
  yield takeEvery(appendSuccess(UPDATE_EVENTS), function* fn({ payload: { data: response } }) {
    const {
      is_success: isSuccess,
      data
    } = response;

    const state = yield select(state => state.ticket);
    const { events } = state;

    const newEvents = [...events];
    const newObj = data[0];
    const index = newEvents.findIndex(item => item.id === newObj.id);

    if (index !== -1) {
      newEvents[index] = newObj;
      yield put(setEventsAction(newEvents));
    }

    if (isSuccess) {
      toastSuccess('Updated, Successfully!');
    }
  });
}

export default function* rootSaga() {
  yield all([
    watchLoginSuccess(),
    watchGetParticipantsSuccess(),
    getPerformanceDetailsSuccess(),
    getEventsSuccess(),
    refundParticipantsSuccess(),
    generateBarcodeSuccess(),
    deleteParticipantsSuccess(),
    updateParticipantsSuccess(),
    getUsersSuccess(),
    updateEventsSuccess()
  ]);
}
