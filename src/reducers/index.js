import { combineReducers } from 'redux'
import locale from './locale'
import errors from './errors'
import user from './user'

export default combineReducers({
  locale,
  errors,
  user
})