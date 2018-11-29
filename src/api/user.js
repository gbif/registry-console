import qs from "qs";
import base64 from 'base-64'
import axios from 'axios';
import config from './util/config'
import axios_cancelable from './util/axiosCancel'
import setHeaders from './util/setHeaders'

export const JWT_STORAGE_NAME = 'jwt';

// use sessionstorage for the session, but save in local storage if user choose to be remembered
const jwt = localStorage.getItem(JWT_STORAGE_NAME);
if (jwt) {
  sessionStorage.setItem(JWT_STORAGE_NAME, jwt);
}

export const search = function(query) {
  return axios_cancelable.get(`${config.dataApi}/admin/user/search?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const login = async function(username, password, remember) {
  return axios.post(`${config.dataApi}/user/login`, {}, {
    headers: {
      'Authorization': `Basic ${base64.encode(username + ":" + password)}`
    }
  })
};

export const whoAmI = async function() {
  const tokenUser = getTokenUser()
  if (!tokenUser) return
  return axios.post(`${config.dataApi}/user/whoami`, {}, {
    headers: setHeaders()
  })
};

export const logout = function() {
  localStorage.removeItem(JWT_STORAGE_NAME);
  sessionStorage.removeItem(JWT_STORAGE_NAME);
};

export const getTokenUser = function() {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (jwt) {
    var user = JSON.parse(base64.decode(jwt.split('.')[1]));
    // is the token still valid - if not then delete it. This of course is only to ensure the client knows that the token has expired. any authenticated requests would fail anyhow
    if (new Date(user.exp * 1000).toISOString() < new Date().toISOString()) {
      logout()
    }
    return user;
  } else {
    return null
  }
}