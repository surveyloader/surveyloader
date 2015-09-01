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

    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.queue
      }

    case 'SET_INDEX':
      return {
        ...state,
        index: action.index
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
        table: null,
        queue: [{}],
        index: 0
      }
  }
})