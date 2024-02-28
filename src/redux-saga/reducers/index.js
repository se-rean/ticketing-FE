/* eslint-disable no-unused-vars */

import { combineReducers } from 'redux';

import {
  appendRequest,
  appendSuccess,
  appendFailed,
  LOGIN,
  SET_TABLE_SELECTED_ROWS,
  SET_TABLE_PAGE,
  SET_TABLE_PAGE_SIZE,
  SET_PARTICIPANTS_DATA,
  SET_AUTH_TOKEN_EXPIRED,
  SET_PERFORMANCE_DETAILS,
  CREATE_EVENT,
  GET_PERFORMANCE_DETAILS,
  CREATE_PARTICIPANTS,
  GET_PARTICIPANTS,
  CREATE_PARTICIPANTS_BARCODE,
  GET_EVENTS,
  SET_EVENTS,
  UPDATE_EVENTS,
  GET_USERS,
  SET_USERS,
  UPDATE_USERS,
  CREATE_USERS,
  GET_LOGS,
  SET_LOGS,
  SET_USER
} from '../action-types';

const login = (state = {
  loading: false,
  isSuccess: null,
  errors: null
}, action) => {
  switch(action.type) {
    case appendRequest(LOGIN):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(LOGIN):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        isSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(LOGIN):
      return {
        ...state,
        loading: false,
        errors: action.error.response.data.errors,
        isSuccess: action.error.response.data.is_success,
        message: action.error.response.data.message
      };
    default:
      return state;
  }
};

const table = (state = {
  selectedIds: [],
  page: 0,
  pageSize: 10,
  totalTableRows: null
}, action) => {
  switch(action.type) {
    case SET_TABLE_SELECTED_ROWS:
      return {
        ...state,
        selectedIds: action.payload
      };
    case SET_TABLE_PAGE:
      return {
        ...state,
        page: action.payload
      };
    case SET_TABLE_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload
      };
    case appendSuccess(GET_PARTICIPANTS):
      return {
        ...state,
        totalTableRows: action.payload.data?.count
      };
    case appendSuccess(GET_EVENTS):
      return {
        ...state,
        totalTableRows: action.payload.data?.count
      };
    case appendSuccess(GET_LOGS):
      return {
        ...state,
        totalTableRows: action.payload.data?.count
      };
    default:
      return state;
  }
};

const ticket = (state = {
  performanceDetails: [],
  createEventSuccess: null,
  createParticipantsSuccess: null,
  errors: null,
  loading: false,
  participantsLoading: false,
  participants: [],
  events: [],
  pendingCount: 0,
  refundedCount: 0,
  soldCount: 0,
  failedCount: 0
}, action) => {
  switch(action.type) {
    case appendRequest(CREATE_EVENT):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(CREATE_EVENT):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        createEventSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(CREATE_EVENT):
      return {
        ...state,
        loading: false
      };
    case appendRequest(UPDATE_EVENTS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(UPDATE_EVENTS):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        createEventSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(UPDATE_EVENTS):
      return {
        ...state,
        loading: false
      };
    case appendRequest(GET_PERFORMANCE_DETAILS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(GET_PERFORMANCE_DETAILS):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        createEventSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(GET_PERFORMANCE_DETAILS):
      return {
        ...state,
        loading: false
      };
    case appendRequest(CREATE_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: true
      };
    case appendSuccess(CREATE_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: false,
        errors: action.payload.data.errors,
        createParticipantsSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(CREATE_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: false
      };
    case appendRequest(GET_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: true
      };
    case appendSuccess(GET_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: false,
        errors: action.payload.data.errors,
        message: action.payload.data.message,
        pendingCount: action.payload.data.pending,
        refundedCount: action.payload.data.refunded,
        soldCount: action.payload.data.sold,
        failedCount: action.payload.data.failed
      };
    case appendFailed(GET_PARTICIPANTS):
      return {
        ...state,
        participantsLoading: false
      };
    case appendRequest(CREATE_PARTICIPANTS_BARCODE):
      return {
        ...state,
        participantsLoading: true
      };
    case appendSuccess(CREATE_PARTICIPANTS_BARCODE):
      return {
        ...state,
        participantsLoading: false,
        errors: action.payload.data.errors,
        isSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(CREATE_PARTICIPANTS_BARCODE):
      return {
        ...state,
        participantsLoading: false
      };
    case SET_PERFORMANCE_DETAILS:
      return {
        ...state,
        performanceDetails: action.payload
      };
    case SET_PARTICIPANTS_DATA:
      return {
        ...state,
        participants: action.payload
      };
    case appendRequest(GET_EVENTS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(GET_EVENTS):
      return {
        ...state,
        loading: false,
        errors: action.payload.data?.errors,
        message: action.payload.data.message
      };
    case appendFailed(GET_EVENTS):
      return {
        ...state,
        loading: false
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload
      };
    default:
      return state;
  }
};

const users = (state = {
  loading: false,
  isSuccess: null,
  errors: null,
  data: [],
  user: null
}, action) => {
  switch(action.type) {
    case appendRequest(GET_USERS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(GET_USERS):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        isSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(GET_USERS):
      return {
        ...state,
        loading: false
      };
    case SET_USERS:
      return {
        ...state,
        data: action.payload
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case appendSuccess(UPDATE_USERS):
      return {
        ...state,
        errors: action.payload.data.errors
      };
    case appendRequest(CREATE_USERS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(CREATE_USERS):
      return {
        ...state,
        errors: action.payload.data.errors,
        loading: false
      };
    case appendFailed(CREATE_USERS):
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

const logs = (state = {
  loading: false,
  isSuccess: null,
  errors: null,
  data: []
}, action) => {
  switch(action.type) {
    case appendRequest(GET_LOGS):
      return {
        ...state,
        loading: true
      };
    case appendSuccess(GET_LOGS):
      return {
        ...state,
        loading: false,
        errors: action.payload.data.errors,
        isSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(GET_LOGS):
      return {
        ...state,
        loading: false
      };
    case SET_LOGS:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
};

const auth = (state = {
  isTokenExpired: false,
  message: ''
}, action) => {
  switch(action.type) {
    case SET_AUTH_TOKEN_EXPIRED:
      return {
        ...state,
        isTokenExpired: action.payload.isTokenExpired,
        message: action.payload.message
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  login,
  table,
  ticket,
  auth,
  users,
  logs
});

export default rootReducer;