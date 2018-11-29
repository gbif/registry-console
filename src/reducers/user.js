import {
  USER_LOGIN,
  USER_LOGOUT
} from '../actions/user'

import { getTokenUser } from '../api/user'

const defaultUser = getTokenUser();

export default function (state = defaultUser, action) {
  switch (action.type) {
    case USER_LOGIN:
      return action.user
    case USER_LOGOUT:
      return null
    default:
      return state
  }
}