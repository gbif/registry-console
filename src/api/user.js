import qs from 'qs';
import base64 from 'base-64';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

export const JWT_STORAGE_NAME = 'jwt';

export const search = query => {
  return axios_cancelable.get(`/admin/user/search?${qs.stringify(query)}`);
};

export const getUser = key => {
  return axios_cancelable.get(`/admin/user/${key}`);
};

export const updateUser = data => {
  return axiosInstance.put(`/admin/user/${data.key}`, data);
};

export const getRoles = () => {
  return axios_cancelable.get(`/admin/user/roles`);
};

export const login = async (username, password, remember) => {
  return axiosInstance.post(`/user/login`, {}, {
    headers: {
      'Authorization': `Basic ${base64.encode(username + ':' + password)}`
    }
  });
};

export const whoAmI = async () => {
  return axiosInstance.post(`/user/whoami`, {});
};

export const logout = () => {
  localStorage.removeItem(JWT_STORAGE_NAME);
  sessionStorage.removeItem(JWT_STORAGE_NAME);
};

export const getTokenUser = () => {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (jwt) {
    const user = JSON.parse(base64.decode(jwt.split('.')[1]));
    // is the token still valid - if not then delete it. This of course is only to ensure the client knows that the token has expired. any authenticated requests would fail anyhow
    if (new Date(user.exp * 1000).toISOString() < new Date().toISOString()) {
      logout();
    }
    return user;
  }

  return null;
};

// use sessionstorage for the session, but save in local storage if user choose to be remembered
const jwt = localStorage.getItem(JWT_STORAGE_NAME);
if (jwt) {
  sessionStorage.setItem(JWT_STORAGE_NAME, jwt);
  getTokenUser();// will log the user out if the token has expired
}