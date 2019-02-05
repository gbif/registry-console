import axios from 'axios';

import config from './config';
import { JWT_STORAGE_NAME } from "../../components/auth/user";
import { Base64 } from "js-base64";

// Checking if there is a valid auth token
const hasActiveToken = () => {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (jwt) {
    const user = JSON.parse(Base64.decode(jwt.split('.')[1]));
    // is the token still valid - if not then delete it. This of course is only to ensure the client knows that the token has expired. any authenticated requests would fail anyhow
    return new Date(user.exp * 1000).toISOString() >= new Date().toISOString();
  }
  return false;
};

// Creating axios custom instance with global base URL
const instance = axios.create({
  baseURL: config.dataApi
});

// On startup load user from storage. Use sessionstorage for the session, but save in local storage if user choose to be remembered
const localJwt = localStorage.getItem(JWT_STORAGE_NAME);
if (localJwt) {
  sessionStorage.setItem(JWT_STORAGE_NAME, localJwt);
  if (hasActiveToken()) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${localJwt}`;
  } else {
    localStorage.removeItem(JWT_STORAGE_NAME);
    sessionStorage.removeItem(JWT_STORAGE_NAME);
    instance.defaults.headers.common['Authorization'] = '';
  }
}

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