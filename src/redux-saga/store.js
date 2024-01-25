/* eslint-disable no-unused-vars */
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import axiosMiddleware from 'redux-axios-middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';
import axios from 'axios';

const sagaMiddleware = createSagaMiddleware();
const authToken = sessionStorage.getItem('token');

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { Authorization: authToken ? `Bearer ${authToken}` : null },
  responseType: 'json'
});

const axiosMiddlewareOptions = {
  interceptors: {
    request: [
      ({ getState }, config) => {
        return {
          ...config,
          headers: { ...config.headers }
        };
      }
    ],
    response: [{
      success: ({ dispatch }, response) => {
        const { config: { method }, data } = response;

        // if (method === 'post' && data.message) {
        //   toastSuccess(data.message);
        // }

        // dispatch(setLoadingAction(false));

        return response;
      },
      error: async ({ dispatch, getSourceAction, getState }, error) => {
        const {
          response: {
            status,
            data
          }
        } = error;

        // if (status !== 200) {
        //   if (status === 422) {
        //     dispatch(setPayloadErrorsAction(data.payloadErrors));
        //   } else {
        //     toastError(data.message);
        //   }
        // }

        // dispatch(setLoadingAction(false));

        return Promise.reject(error);
      }
    }],
    errorSuffix: 'FAILED'
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(
    axiosMiddleware(axiosClient, axiosMiddlewareOptions),
    sagaMiddleware
  ))
);

sagaMiddleware.run(rootSaga);

export default store;

