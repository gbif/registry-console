import axios from 'axios';
import config from './config';
export const JWT_STORAGE_NAME = 'jwt';

// Setting Authorization header initially on app's first load
const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
const headers = {};
if (jwt) {
  headers['Authorization'] = `Bearer ${jwt}`;
}
// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi,
  headers
});

// Add a request interceptor
instance.interceptors.response.use(
  response => {
    const { token } = response.headers;

    if (token && sessionStorage.getItem(JWT_STORAGE_NAME) !== null) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem(JWT_STORAGE_NAME, token);
      if (localStorage.getItem(JWT_STORAGE_NAME)) {
        localStorage.setItem(JWT_STORAGE_NAME, token);
      }
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