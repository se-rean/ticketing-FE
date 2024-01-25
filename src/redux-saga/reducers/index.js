/* eslint-disable no-unused-vars */

import { combineReducers } from 'redux';

import {
  appendRequest,
  appendSuccess,
  appendFailed,
  LOGIN
} from '../action-types';

const login = (state = {
  loading: false,
  is_success: null,
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
        is_success: action.payload.data.is_success,
        message: action.payload.data.message
      };
    case appendFailed(LOGIN):
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({ login });

export default rootReducer;