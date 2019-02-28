import axios from 'axios';
import { Base64 } from 'js-base64';

import config from './config';
import { logout } from '../../components/auth/user';
import { getCookie, setCookie } from '../../components/util/helpers';

export const JWT_STORAGE_NAME = 'jwt';

/**
 * Checks if token hasn't expired yet
 * @returns {boolean}
 */
const hasActiveToken = () => {
  const jwt = getCookie(JWT_STORAGE_NAME);
  if (jwt) {
    const user = JSON.parse(Base64.decode(jwt.split('.')[1]));
    // is the token still valid - if not then delete it. This of course is only to ensure the client knows that the token has expired. any authenticated requests would fail anyhow
    return new Date(user.exp * 1000).toISOString() >= new Date().toISOString();
  }
  return false;
};

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
  // if we do not have cookie, we should unset header
  if (!hasActiveToken()) {
    logout();
    // window.location.reload(); // reloading page to remove all user data from the app state
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