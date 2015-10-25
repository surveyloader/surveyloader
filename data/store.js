import { createStore } from 'redux'
import update from 'react/lib/update'

export default createStore(function (state, action) {
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

    case 'SET_RESPONSES':
      return {
        ...state,
        keys: action.keys,
        data: action.data
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