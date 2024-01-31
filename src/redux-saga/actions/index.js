import {
  setTypes,
  LOGIN,
  SET_TABLE_SELECTED_ROWS,
  SET_TABLE_PAGE,
  SET_TABLE_PAGE_SIZE,
  SET_PARTICIPANTS_DATA,
  GET_PARTICIPANTS,
  CREATE_EVENT,
  GET_PERFORMANCE_DETAILS,
  SET_PERFORMANCE_DETAILS,
  SET_AUTH_TOKEN_EXPIRED,
  CREATE_PARTICIPANTS
} from '../action-types';

export const loginAction = (payload) => ({
  types: setTypes(LOGIN),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Auth/login',
      data: payload
    }
  }
});

export const setTableSelectedIdsAction = (payload) => ({
  type: SET_TABLE_SELECTED_ROWS,
  payload
});

export const setTablePageAction = (payload) => ({
  type: SET_TABLE_PAGE,
  payload
});

export const setTablePageSizeAction = (payload) => ({
  type: SET_TABLE_PAGE_SIZE,
  payload
});

export const getParticipantsAction = ({
  performanceCode,
  page,
  pageSize
}) => ({
  types: setTypes(GET_PARTICIPANTS),
  payload: {
    request: {
      method: 'GET',
      url: `v1/Ticketing/participants/${performanceCode}?page=${page}&page_size=${pageSize}`
    }
  }
});

export const setParticipantsDataAction = (payload) => ({
  type: SET_PARTICIPANTS_DATA,
  payload
});

export const createEventAction = (payload) => ({
  types: setTypes(CREATE_EVENT),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Ticketing/create-event',
      data: payload
    }
  }
});

export const getPerformanceDetailsAction = (payload) => ({
  types: setTypes(GET_PERFORMANCE_DETAILS),
  payload: {
    request: {
      method: 'GET',
      url: `v1/Ticketing/performance-map/${payload}`
    }
  }
});

export const setPerformanceDetailsAction = (payload) => ({
  type: SET_PERFORMANCE_DETAILS,
  payload
});

export const setAuthTokenExpired = (payload) => ({
  type: SET_AUTH_TOKEN_EXPIRED,
  payload
});

export const createParticipantAction = (payload) => ({
  types: setTypes(CREATE_PARTICIPANTS),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Ticketing/create-participants',
      data: { participants: payload }
    }
  }
});