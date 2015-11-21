import React, { DOM, createFactory as $ } from 'react'
import Radium from 'radium'
import styles from './styles'
import http from 'superagent'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import store from '../store'

import Crud from '../Crud'
import Json from '../Json'
import Preview from '../Preview'
import Table from '../Table'
import Queue from '../Queue'
import Parameters from '../Parameters'

import simulateOver from '../../global/services/simulateOver'

@DragDropContext(HTML5Backend)
@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })
  }

  shouldComponentUpdate (newProps, newState) {
    const { selected, initTable, queue } = this.state
    if (newState.selected !== selected) {
      let table = simulateOver(initTable, queue.slice(0, newState.selected))
      store.dispatch({ 
        type: 'SET_ACC_TABLE',
        table: _.omit(table, (v, k) => _.has(initTable, k))
      })
      return false
    }
    return true
  }

  render () {
    const { state } = this
    const params = state.queue[state.selected]

    return DOM.div({
      style: [styles.main],
      children: [
        $(Crud)({ ...state, store }),
        $(Json)({
          data: {
            info: state.info,
            table: state.initTable,
            queue: state.queue
          }
        }),
        $(Preview)({
          params,
          table: { ...state.initTable, ...state.accTable }
        }),
        DOM.div({
          style: [styles.row],
          children: [
            $(Table)({ ...state, store }),
            $(Queue)({ ...state, store }),
            $(Parameters)({
              ...state,
              params,
              store
            })
          ]
        })
      ]
    })
  }
}

export default Container