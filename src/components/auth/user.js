import base64 from 'base-64';
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
      'Authorization': `Basic ${base64.encode(username + ':' + password)}`
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

const hasActiveToken = () => {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (jwt) {
    const user = JSON.parse(base64.decode(jwt.split('.')[1]));
    // is the token still valid - if not then delete it. This of course is only to ensure the client knows that the token has expired. any authenticated requests would fail anyhow
    return new Date(user.exp * 1000).toISOString() >= new Date().toISOString();
  }
  return false;
};

// Adding Authorization header for all requests
const addAuthToken = (jwt) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
};

// On startup load user from storage. Use sessionstorage for the session, but save in local storage if user choose to be remembered
const localStorageJwt = localStorage.getItem(JWT_STORAGE_NAME);
if (localStorageJwt) {
  sessionStorage.setItem(JWT_STORAGE_NAME, localStorageJwt);
  if (hasActiveToken()) {
    addAuthToken(localStorageJwt);
  } else {
    logout();// will log the user out if the token has expired
  }
}

