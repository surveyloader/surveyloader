import { createStore } from 'redux'

export default createStore(function (state, action) {
  switch (action.type) {

    case 'SET_ASPECTS':
      return { 
        ...state, 
        aspects: action.aspects,
        rated: action.aspects.map(() => false)
      }

    case 'CHANGE_RATING':
      state.aspects[state.index].rating = Number(action.rating)
      return state
    
    case 'CONFIRM_RATING':
      state.rated[state.index] = true
      if (!state.rated.reduce((a, b) => a && b, true)) {
        return {
          ...state,
          index: state.aspects
            .filter((a, i) => !state.rated[i])[0].index
        }
      } else {
        return {
          ...state,
          index: -1
        }
      }

    case 'EDIT_RATING':
      state.rated[action.index] = false
      return {
        ...state,
        index: action.index
      }
    
    default:
      return {
        aspects: [{ 
          text: null,
          rating: null,
          index: 0 
        }],
        rated: [],
        index: 0
      }
  }
})