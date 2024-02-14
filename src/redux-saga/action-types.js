export const setTypes = (type) => {
  return [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILED`];
};

export const appendRequest = (type) => {
  return `${type}_REQUEST`;
};

export const appendSuccess = (type) => {
  return `${type}_SUCCESS`;
};

export const appendFailed = (type) => {
  return `${type}_FAILED`;
};

export const LOGIN = 'LOGIN';
export const SET_TABLE_SELECTED_ROWS = 'SET_TABLE_SELECTED_ROWS';
export const SET_TABLE_PAGE = 'SET_TABLE_PAGE';
export const SET_TABLE_PAGE_SIZE = 'SET_TABLE_PAGE_SIZE';

export const GET_PARTICIPANTS = 'GET_PARTICIPANTS';
export const SET_PARTICIPANTS_DATA = 'SET_PARTICIPANTS_DATA';

export const GET_EVENTS = 'GET_EVENTS';
export const SET_EVENTS = 'SET_EVENTS';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';

export const GET_PERFORMANCE_DETAILS = 'GET_PERFORMANCE_DETAILS';
export const SET_PERFORMANCE_DETAILS = 'SET_PERFORMANCE_DETAILS';

export const CREATE_PARTICIPANTS = 'CREATE_PARTICIPANTS';
export const CREATE_RANDOM_PARTICIPANTS = 'CREATE_RANDOM_PARTICIPANTS';
export const CREATE_PARTICIPANTS_BARCODE = 'CREATE_PARTICIPANTS_BARCODE';
export const REFUND_PARTICIPANTS = 'REFUND_PARTICIPANTS';
export const DELETE_PARTICIPANTS = 'DELETE_PARTICIPANTS';
export const UPDATE_PARTICIPANTS = 'UPDATE_PARTICIPANTS';

export const SET_AUTH_TOKEN_EXPIRED = 'SET_AUTH_TOKEN_EXPIRED';