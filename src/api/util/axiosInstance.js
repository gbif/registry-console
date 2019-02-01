import axios from 'axios';
import config from './config';

// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi
});

// Add a request interceptor
instance.interceptors.response.use(
  response => response,
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