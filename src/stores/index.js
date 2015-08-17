import { createStore } from 'redux'

export default createStore(function (state, action) {
  switch (action.type) {
    case 'SET':
      return {
        ...state,
        queue: action.queue,
        table: action.table
      }

    case 'SET_TABLE':
      return {
        ...state,
        table: action.table
      }


    case 'PUSH':
      return {
        ...state,
        table: {
          ...state.table,
          ...action.table
        },
        index: action.index
      }

    default:
      return {
        ...state,
        component: null,
        table: null,
        index: 0
      }
  }
})