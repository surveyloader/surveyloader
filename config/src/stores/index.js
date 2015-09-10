import { createStore } from 'redux'

export default createStore(function (state, action) {
  switch (action.type) {
    case 'SET_SURVEYS':
      return {
        ...state,
        surveys: action.surveys
      }

    case 'SET_MODULE_LIST':
      return {
        ...state,
        modules: action.modules
      }

    case 'SELECT_SURVEY':
      return {
        ...state,
        index: 0,
        survey: action.survey
      }

    case 'SET_QUEUE':
      return {
        ...state,
        survey: {
          ...state.survey,
          queue: action.queue
        }
      }

    case 'SELECT_QUEUE':
      return {
        ...state,
        index: action.index
      }

    case 'PUSH':
      return {
        ...state,
        survey: {
          ...state.survey,
          table: {
            ...state.survey.table,
            ...action.table
          }
        },
        index: action.index
      }


    default:
      return {
        ...state,
        surveys: {},
        modules: [],
        index: 0,
        survey: {
          info: {
            name: null,
            author: null
          },
          table: {},
          queue: []
        }
      }
  }
})