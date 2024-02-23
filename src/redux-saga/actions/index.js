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
  CREATE_PARTICIPANTS,
  CREATE_PARTICIPANTS_BARCODE,
  GET_EVENTS,
  SET_EVENTS,
  REFUND_PARTICIPANTS,
  DELETE_PARTICIPANTS,
  CREATE_RANDOM_PARTICIPANTS,
  UPDATE_PARTICIPANTS,
  UPDATE_EVENTS,
  GET_USERS,
  SET_USERS,
  UPDATE_USERS,
  CREATE_USERS,
  DELETE_USERS,
  SET_LOGS,
  GET_LOGS
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
  pageSize,
  status,
  search = ''
}) => ({
  types: setTypes(GET_PARTICIPANTS),
  payload: {
    request: {
      method: 'GET',
      url: `v1/Ticketing/participants/${performanceCode}?page=${page}&page_size=${pageSize}&status=${status}`,
      search,
      status
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

export const createParticipantsAction = (payload) => ({
  types: setTypes(CREATE_PARTICIPANTS),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Ticketing/create-participants',
      data: { participants: payload }
    }
  }
});

export const createParticipantsBarcodeAction = (payload) => ({
  types: setTypes(CREATE_PARTICIPANTS_BARCODE),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Ticketing/create-barcode',
      data: {
        ...payload,
        limit: 1000000
      }
    }
  }
});

export const getEventsAction = (payload) => ({
  types: setTypes(GET_EVENTS),
  payload: {
    request: {
      method: 'GET',
      url: 'v1/Ticketing/events',
      search: payload?.search || ''
    }
  }
});

export const setEventsAction = (payload) => ({
  type: SET_EVENTS,
  payload
});

export const refundParticipantsAction = (payload) => ({
  types: setTypes(REFUND_PARTICIPANTS),
  payload: {
    request: {
      method: 'PUT',
      url: `v1/Ticketing/refund?PCODE=${payload.performanceCode}`,
      data: { participants: payload.participants }
    }
  }
});

export const deleteParticipantsAction = (payload) => ({
  types: setTypes(DELETE_PARTICIPANTS),
  payload: {
    request: {
      method: 'DELETE',
      url: `v1/Ticketing/participants?id=${payload}`
    }
  }
});

export const createRandomParticipantsAction = (payload) => ({
  types: setTypes(CREATE_RANDOM_PARTICIPANTS),
  payload: {
    request: {
      method: 'POST',
      url: `v1/Ticketing/create-random-participants/${payload.performanceCode}`,
      data: { category: payload.data }
    }
  }
});

export const updateParticipantsAction = (payload) => ({
  types: setTypes(UPDATE_PARTICIPANTS),
  payload: {
    request: {
      method: 'PUT',
      url: `v1/Ticketing/participants/?id=${payload.participantId}`,
      data: payload.data
    }
  }
});

export const updateEventsAction = (payload) => ({
  types: setTypes(UPDATE_EVENTS),
  payload: {
    request: {
      method: 'PUT',
      url: `v1/Ticketing/update-event/?PCODE=${payload.performanceCode}`,
      data: payload.data
    }
  }
});

export const getUsersAction = (payload) => ({
  types: setTypes(GET_USERS),
  payload: {
    request: {
      method: 'GET',
      url: 'v1/User',
      search: payload?.search || ''
    }
  }
});

export const setUsersAction = (payload) => ({
  type: SET_USERS,
  payload
});

export const updateUsersAction = ({ payload, type }) => ({
  types: setTypes(UPDATE_USERS),
  payload: {
    request: {
      method: 'PUT',
      url: 'v1/User',
      data: payload,
      type: type
    }
  }
});

export const createUsersAction = (payload) => ({
  types: setTypes(CREATE_USERS),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/User',
      data: payload
    }
  }
});

export const deleteUsersAction = (payload) => ({
  types: setTypes(DELETE_USERS),
  payload: {
    request: {
      method: 'DELETE',
      url: `v1/User/${payload.id}`,
      data: payload
    }
  }
});

export const getLogsAction = ({
  page,
  pageSize,
  type,
  search = ''
}) => ({
  types: setTypes(GET_LOGS),
  payload: {
    request: {
      method: 'GET',
      url: `v1/Logs?page=${page}&page_size=${pageSize}&type=${type === 'All Actions' ? '' : type}`,
      search,
      type
    }
  }
});

export const setLogsAction = (payload) => ({
  type: SET_LOGS,
  payload
});
