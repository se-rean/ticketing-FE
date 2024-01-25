import {
  setTypes,
  LOGIN
} from '../action-types';

export const loginAction = ({ payload }) => ({
  types: setTypes(LOGIN),
  payload: {
    request: {
      method: 'POST',
      url: 'v1/Auth/login',
      data: payload
    }
  }
});