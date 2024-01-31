import axios from 'axios';
import isBrowser from 'utils/is-browser';
// NOTE: import messages from '@/messages';

import _ from 'lodash';
import { getToken, removeToken, getLastWorkspace } from 'utils/token';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});
export const setAuthHeader = (token) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    client.defaults.headers.common['last-accessed-workspace'] = getLastWorkspace()?.lastAccessedWorkspace || '';
  }
};

if (isBrowser()) {
  setAuthHeader(getToken());
}

const onSuccess = function (response) {
  const isLoginRequest =
    response.config.url.endsWith('/login') ||
    response.config.url.endsWith('/accept-invite') ||
    response.config.url.endsWith('/activate-account') ||
    response.config.url.endsWith('/onboarding'); // NOTE: Assuming the login endpoint ends with '/login'.
  return isLoginRequest ? response : response.data;
};

const onError = function (error) {
  console.error('Request Failed:', error.config);
  if (error.response) {
    // NOTE: Request was made but server responded with something
    // NOTE: other than 2xx
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
    if (
      (error.response.status === 401 && error.response?.data?.msg === 'Session Expired!') ||
      error.response?.data?.msg === 'Login Required!' ||
      error.response?.data?.msg === 'Workspace not found, deleted' ||
      error.response?.data?.msg === 'You are not allowed access to this workspace'
    ) {
      removeToken();
      isBrowser() && (window.location.href = '/login');
    }
  } else {
    // NOTE: Something else happened while setting up the request
    // NOTE: triggered the error
    console.error('Error Message:', error.message);
  }

  return Promise.reject({
    msg: !error?.response
      ? 'Network Issue!'
      : error?.response?.data?.msg || 
        _.values(error?.response?.data?.error)[0] || 
        error?.response?.data?.message, 
    validations: error?.response?.data?.error ? error?.response?.data?.error : null,
    status: error?.response?.status || 'not status',
  });
};

client.interceptors.request.use((config) => {
  const token = getToken();
  if (
    !config?.headers?.common?.Authorization ||
    config?.headers?.common?.Authorization?.search('null') !== -1 ||
    token
  ) {
    config.headers['Authorization'] = token;
  }
  return config;
});

client.interceptors.response.use(onSuccess, onError);
export default client;
