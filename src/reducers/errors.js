import {
  ERROR_ADD,
  ERROR_CLEAR_ALL
} from '../actions/errors'

export default function (state = [], action) {
  switch (action.type) {
    case ERROR_ADD:
      return [...state, action.error]
    case ERROR_CLEAR_ALL:
      return []
    default:
      return state
  }
}