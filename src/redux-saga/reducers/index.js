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
  CREATE_PARTICIPANTS
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
  pageSize: 10
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
    default:
      return state;
  }
};

const participants = (state = {
  data: [],
  loading: false
}, action) => {
  switch(action.type) {
    case SET_PARTICIPANTS_DATA:
      return {
        ...state,
        data: action.payload
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
  generateParticipantLoading: false
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
        loading: false,
        errors: action.error.response.data.errors,
        createEventSuccess: action.error.response.data.is_success,
        message: action.error.response.data.message
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
        loading: false,
        errors: action.payload.data.errors,
        isSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendRequest(CREATE_PARTICIPANTS):
      return {
        ...state,
        generateParticipantLoading: true
      };
    case appendSuccess(CREATE_PARTICIPANTS):
      return {
        ...state,
        generateParticipantLoading: false,
        errors: action.payload.data.errors,
        createParticipantsSuccess: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(CREATE_PARTICIPANTS):
      return {
        ...state,
        generateParticipantLoading: false,
        errors: action.error.response.data.errors,
        createParticipantsSuccess: action.error.response.data.is_success,
        message: action.error.response.data.message
      };
    case SET_PERFORMANCE_DETAILS:
      return {
        ...state,
        performanceDetails: action.payload
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
  participants,
  ticket,
  auth
});

export default rootReducer;