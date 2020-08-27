import axios from 'axios';

import config from './config';
import { logout } from '../../components/auth/user';
import { getCookie, setCookie } from '../../components/util/helpers';

export const JWT_STORAGE_NAME = 'jwt';

// Getting Authorization header initially on app's first load
const jwt = getCookie(JWT_STORAGE_NAME);
// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi
});
// Alter defaults after instance has been created
if (jwt) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
}

instance.interceptors.request.use(config => {
  const jwt = getCookie(JWT_STORAGE_NAME);
  // if we do not have cookie and next request is not a login request, we should unset header
  if (!jwt && !config.url.endsWith('login')) {
    logout();
  }

  return config;
});

// Add a request interceptor
instance.interceptors.response.use(
  response => {
    const { token } = response.headers;
    // Renewing our local version of token
    if (token && getCookie(JWT_STORAGE_NAME) !== undefined) {
      // Setting expiration data +30 minutes
      setCookie(JWT_STORAGE_NAME, token, { expires: 1800 });
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return response;
  },
  error => {
    // If a Network error
    if (!error.response) {
      error.response = {
        data: 'Network Error',
        status: 523
      }
    }
    return Promise.reject(error);
  }
);

export default instance;