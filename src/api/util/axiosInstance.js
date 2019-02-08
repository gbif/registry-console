import axios from 'axios';
import config from './config';

import { logout } from '../../components/auth/user';

export const JWT_STORAGE_NAME = 'jwt';

// Getting Authorization header initially on app's first load
const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi
});
// Alter defaults after instance has been created
if (jwt) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
}

// Add a request interceptor
instance.interceptors.response.use(
  response => {
    const { token } = response.headers;
    // Renewing our local version of token
    if (token && sessionStorage.getItem(JWT_STORAGE_NAME) !== null) {
      sessionStorage.setItem(JWT_STORAGE_NAME, token);
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (sessionStorage.getItem(JWT_STORAGE_NAME) !== null) {
      // if we have expired token we should logout user
      logout();
      window.location.reload(); // reloading page to remove all user data from the app state
    }
    return response;
  },
  // response => response,
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