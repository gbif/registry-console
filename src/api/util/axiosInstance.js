import axios from 'axios';

import config from './config';
import {JWT_STORAGE_NAME} from "../../components/auth/user";

// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi
});

// Add a request interceptor
instance.interceptors.response.use(
  response => {
    const {token} = response.headers;
    if (token) {
      // Renewing user's token
      sessionStorage.setItem(JWT_STORAGE_NAME, token);
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Also, we should update token in localStorage if user chose to be logged in
      if (localStorage.getItem(JWT_STORAGE_NAME) !== null) {
        localStorage.setItem(JWT_STORAGE_NAME, token);
      }
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