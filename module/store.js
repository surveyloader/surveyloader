import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
  console.log(state, action)
  switch (action.type) {
    case 'CHANGE_MODULE_TYPE':
      return {
        ...state,
        module: {
          type: action.into
        }
      }

    case 'CHANGE_MODULE_PARAMS':
      return {
        ...state,
        module: {
          ...state.module,
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
        module: {}
      }
  }
})