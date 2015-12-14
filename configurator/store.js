import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
  console.log(action.type, state)
  switch (action.type) {
    case 'AUTHORIZE':
      return {
        ...state,
        auth: action.info
      }

    case 'SET_SURVEY_LIST':
      const surveys = action.surveys
      const surveyName = Object.keys(surveys)[0]
      const surveyVersion = Object.keys(surveys[surveyName]).reverse()[0]
      return {
        ...state,
        surveys,
        surveyName,
        surveyVersion
      }

    case 'SELECT_SURVEY_NAME':
      return {
        ...state,
        surveyName: action.surveyName,
        surveyVersion: Object.keys(state.surveys[action.surveyName])
          .reverse()[0]
      }

    case 'SELECT_SURVEY_VERSION':
      return {
        ...state,
        surveyVersion: action.surveyVersion
      }

    case 'LOAD_SURVEY':
      return {
        ...state,
        selected: 0,
        initTable: action.survey.table || {},
        queue: action.survey.queue ? action.survey.queue
          .map((m, i) => { 
            return { ...m, id: i + 1 }
          }) : []
      }

    case 'CREATE_SURVEY':
      return {
        ...state,
        initTable: {},
        accTable: {},
        queue: [],
        selected: 0
      }

    case 'SET_INIT_TABLE':
      return {
        ...state,
        initTable: action.table
      }

    case 'SET_ACC_TABLE':
      return {
        ...state,
        accTable: action.table
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

    case 'REMOVE_QUEUE_MODULE':
      var items = state.queue

      var item = items.filter((o) => o.id === action.id)[0]
      var itemIndex = items.indexOf(item)
      var selected = Math.max(itemIndex - 1, 0)
      console.log(itemIndex, selected)
      return {
        ...state,
        selected: 0,
        queue: items.filter((o) => o.id !== action.id)
      }

    case 'SELECT_QUEUE_MODULE':
      var items = state.queue

      var item = items.filter((o) => o.id === action.id)[0]
      var itemIndex = items.indexOf(item)
      return {
        ...state,
        params: null,
        selected: itemIndex
      }

    case 'ADD_QUEUE_MODULE':
      return {
        ...state,
        selected: state.queue.length,
        params: null,
        queue: state.queue.concat({ type: action.module })
          .map((m, i) => { 
            return { ...m, id: i + 1 }
          })
      }

    case 'CHANGE_MODULE_PARAMS':
      state.queue[state.selected] = {
        ...state.queue[state.selected],
        ...action.params
      }
      return {
        ...state,
        queue: state.queue
      }

    default:
      return {
        ...state,
        surveys: {},
        modules: [],
        initTable: {},
        accTable: {},
        queue: [],
        selected: 0
      }
  }
})