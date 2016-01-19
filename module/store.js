import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
  console.log(action.type, action)
  switch (action.type) {
    case 'CHANGE_MODULE_TYPE':
      return {
        ...state,
        params: {
          type: action.into
        }
      }

    case 'SET_MODULE_PARAMS':
      return {
        ...state,
        params: {
          ...state.params,
          ...action.params
        }
      }

    case 'CHANGE_MODULE_PARAMS':
      return {
        ...state,
        params: {
          ...state.params,
          ...action.params
        }
      }

    case 'FULL_SCREEN':
      return {
        ...state,
        fullscreen: action.enabled
      }

    default:
      return {
        ...state,
        params: {}
      }
  }
})