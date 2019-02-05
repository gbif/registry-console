import { Base64 } from 'js-base64';

import { decorateUser } from './userUtil';
import axiosInstance from '../../api/util/axiosInstance';

export const JWT_STORAGE_NAME = 'jwt';

export const getUser = async () => {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (!jwt) return;

  try {
    const user = (await axiosInstance.post(`/user/whoami`, {})).data;
    return decorateUser(user);
  } catch (err) {
    const statusCode = err.response.status;
    if (statusCode < 500) {
      // The jwt is no longer valid - delete the token
      logout();
      window.location.reload();
    } else {
      throw err;
    }
  }
};

export const login = async (username, password, keepUserLoggedIn) => {
  return axiosInstance.post(`/user/login`, {}, {
    headers: {
      'Authorization': `Basic ${Base64.encode(username + ':' + password)}`
    }
  }).then(response => {
    const user = response.data;
    const jwt = user.token;
    sessionStorage.setItem(JWT_STORAGE_NAME, jwt);
    if (keepUserLoggedIn) {
      localStorage.setItem(JWT_STORAGE_NAME, jwt);
    }

    // Setting Authorization header for all requests
    addAuthToken(jwt);

    return decorateUser(user);
  });
};

export const logout = () => {
  localStorage.removeItem(JWT_STORAGE_NAME);
  sessionStorage.removeItem(JWT_STORAGE_NAME);
  // Unset Authorization header after logout
  axiosInstance.defaults.headers.common['Authorization'] = '';
};

// Adding Authorization header for all requests
const addAuthToken = jwt => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

