import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
  switch (action.type) {
    case 'SET_SURVEY_LIST':
      return {
        ...state,
        surveys: action.surveys
      }

    case 'SELECT_SURVEY':
      return {
        ...state,
        selected: 0,
        params: {},
        startingTable: action.survey.table,
        table: action.survey.table,
        queue: action.survey.queue
          .map((m, i) => { 
            return { ...m, id: i + 1 }
          })
      }

    case 'SET_TABLE':
      return {
        ...state,
        table: action.table
      }

    case 'SET_MODULE_LIST':
      return {
        ...state,
        modules: action.modules
      }

    case 'MOVE_QUEUE_MODULE':
      var items = state.queue

      var item = items.filter((o) => o.id === action.id)[0]
      var afterItem = items.filter((o) => o.id === action.afterId)[0]
      var itemIndex = items.indexOf(item)
      var afterIndex = items.indexOf(afterItem)
      return update(state, {
        queue: {
          $splice: [
            [itemIndex, 1],
            [afterIndex, 0, item]
          ]
        }
      })

    case 'SELECT_QUEUE_MODULE':
      var items = state.queue

      var item = items.filter((o) => o.id === action.id)[0]
      var itemIndex = items.indexOf(item)
      return {
        ...state,
        selected: itemIndex
      }

    case 'ADD_QUEUE_MODULE':
      return {
        ...state,
        selected: state.queue.length,
        params: {},
        queue: state.queue.concat({ type: action.module })
          .map((m, i) => { 
            return { ...m, id: i + 1 }
          })
      }

    default:
      return {
        ...state,
        surveys: {},
        modules: [],
        startingTable: {},
        table: {},
        queue: [],
        selected: 0,
        params: {}
      }
  }
})