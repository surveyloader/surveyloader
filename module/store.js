import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
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

    default:
      return {
        ...state,
        module: {}
      }
  }
})