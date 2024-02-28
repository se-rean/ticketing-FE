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
  UPDATE_EVENTS,
  UPDATE_USERS,
  CREATE_USERS,
  DELETE_USERS,
  GET_LOGS,
  GET_USER
} from '../action-types';

import {
  setEventsAction,
  setLogsAction,
  setParticipantsDataAction,
  setPerformanceDetailsAction,
  setUserAction,
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
  yield takeEvery([ appendSuccess(GET_PARTICIPANTS) ], function* fn({ payload: { data: response, config: { search: searchValue, status: statusValue } } }) {
    const { is_success: isSuccess, data } = response;

    if (isSuccess) {
      const mappedData = data.map(i => ({
        ...i,
        fullName: `${i.firstname} ${i.lastname}`
      }));

      const getParticipantsStatus = () => {
        switch(statusValue) {
          case 1:
            return 'pending';
          case 2:
            return 'refunded';
          case 3:
            return 'failed';
          case 4:
            return 'sold';
          default:
            return '';
        }
      };

      const filterData = !isEmpty(getParticipantsStatus())
        ? mappedData.filter(i => i.status.includes(getParticipantsStatus()))
        : mappedData;

      yield put(setParticipantsDataAction(filterData));
    }
  });
}

function* watchGetPerformanceDetailsSuccess() {
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

function* watchGetEventsSuccess() {
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

function* watchUpdateEventsSuccess() {
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
      toastSuccess('Updated successfully.');
    }
  });
}

function* watchRefundParticipantsSuccess() {
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

function* watchGenerateBarcodeSuccess() {
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

function* watchDeleteParticipantsSuccess() {
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

function* watchUpdateParticipantsSuccess() {
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

function* watchGetUsersSuccess() {
  yield takeEvery(appendSuccess(GET_USERS), function* fn({ payload: { data: response, config: { search: searchValue } } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      const user = JSON.parse(sessionStorage.getItem('user'));

      const mappedData = data.map(i => ({
        ...i,
        fullName: `${i.fname} ${i.mname} ${i.lname}`
      })).filter(i => i.id !== user.id);

      yield put(setUsersAction(mappedData));
    }
  });
}

function* watchGetUserSuccess() {
  yield takeEvery(appendSuccess(GET_USER), function* fn({ payload: { data: response } }) {
    const {
      data,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      yield put(setUserAction(data[0]));
    }
  });
}

function* watchCreateUserSuccess() {
  yield takeEvery(appendSuccess(CREATE_USERS), function* fn({ payload: { data: response } }) {
    const {
      errors,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      toastSuccess('Created, Successfully!');
    }
  });
}

function* watchUpdateUserSuccess() {
  yield takeEvery(appendSuccess(UPDATE_USERS), function* fn({ payload: { data: response, config } }) {
    const {
      errors,
      is_success: isSuccess
    } = response;

    const { data: payloadData, type } = config;

    if (isSuccess) {
      if (type === 'update-profile') {
        const userDetails = JSON.parse(sessionStorage.getItem('user'));
        const newUserDetails = Object.assign(userDetails, JSON.parse(payloadData));
        sessionStorage.setItem('user', JSON.stringify(newUserDetails));
      }

      toastSuccess('Updated, Successfully!');
    }
  });
}

function* watchDeleteUserSuccess() {
  yield takeEvery(appendSuccess(DELETE_USERS), function* fn({ payload, payload: { data: response, config } }) {
    const {
      errors,
      is_success: isSuccess
    } = response;

    if (isSuccess) {
      const { reduxSourceAction: { payload: { request: { data: { id: idToDelete } } } } } = config;

      const state = yield select(state => state.users);
      const { data: usersData } = state;

      const newUsersData = [...usersData];
      const indexToDelete = newUsersData.findIndex(i => i.id === idToDelete);

      if (indexToDelete !== -1) {
        newUsersData.splice(indexToDelete, 1);
      }

      yield put(setUsersAction(newUsersData));

      toastSuccess('Deleted, Successfully!');
    }
  });
}

function* watchGetLogsSuccess() {
  yield takeEvery([ appendSuccess(GET_LOGS) ], function* fn({ payload: { data: response, config: { type: typeValue } } }) {
    const { is_success: isSuccess, data: { rows: data } } = response;

    if (isSuccess) {
      const mappedData = data.map(i => ({
        ...i,
        user: `${i.user_data.fname} ${i.user_data.mname} ${i.user_data.lname}`,
        username: i.user_data.username
      }));

      const tempTypeValue = typeValue.includes('All Actions') ? '' : typeValue;

      const filterData = !isEmpty(tempTypeValue)
        ? mappedData.filter(i => i.type.includes(tempTypeValue))
        : mappedData;

      yield put(setLogsAction(filterData));
    }
  });
}

export default function* rootSaga() {
  yield all([
    watchLoginSuccess(),
    watchGetParticipantsSuccess(),
    watchGetPerformanceDetailsSuccess(),
    watchRefundParticipantsSuccess(),
    watchGenerateBarcodeSuccess(),
    watchDeleteParticipantsSuccess(),
    watchUpdateParticipantsSuccess(),
    watchGetUsersSuccess(),
    watchGetUserSuccess(),
    watchUpdateEventsSuccess(),
    watchGetPerformanceDetailsSuccess(),
    watchGetEventsSuccess(),
    watchRefundParticipantsSuccess(),
    watchGenerateBarcodeSuccess(),
    watchDeleteParticipantsSuccess(),
    watchUpdateParticipantsSuccess(),
    watchGetUsersSuccess(),
    watchUpdateUserSuccess(),
    watchCreateUserSuccess(),
    watchDeleteUserSuccess(),
    watchGetLogsSuccess()
  ]);
}
