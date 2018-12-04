import { addError } from './errors';
import getDeep from 'lodash/get';
import { whoAmI, login as logUserIn, logout as logUserOut, JWT_STORAGE_NAME } from '../api/user';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export const setUser = user => ({
  type: USER_LOGIN,
  user: user
});

export const clearUser = () => ({
  type: USER_LOGOUT
});

export const login = ({ userName, password, remember }) => async (dispatch, getState) => {
  logUserIn(userName, password, remember)
    .then(res => {
      const user = res.data;
      const jwt = user.token;
      sessionStorage.setItem(JWT_STORAGE_NAME, jwt);
      if (remember) {
        localStorage.setItem(JWT_STORAGE_NAME, jwt);
      }
      dispatch(setUser(user));
    })
    .catch(err => {
      dispatch(addError(err.response));
    });
};

export const logout = () => async (dispatch, getState) => {
  logUserOut();
  dispatch(clearUser());
};

export const loadTokenUser = () => async (dispatch, getState) => {
  const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
  if (jwt) {
    whoAmI().then(res => {
      dispatch(setUser(res.data));
    })
      .catch(err => {
        const statusCode = getDeep(err, 'response.status', 500);
        if (statusCode < 500) {
          logUserOut();
          dispatch(clearUser());
          window.location.reload();
        } else {
          dispatch(addError(err.response));
        }
      });
  }
};