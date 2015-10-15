import React from 'react'
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
    const {
      modules,
      surveys,
      surveyName,
      surveyVersion,
      auth,
      info,
      queue,
      initTable,
      accTable,
      selected
    } = this.state

    const crudProps = {
      info,
      auth,
      initTable,
      queue,
      store,
      surveys,
      surveyName,
      surveyVersion
    }

    const jsonProps = {
      data: {
        info,
        table: initTable,
        queue 
      }
    }

    const previewProps = {
      module: queue[selected],
      table: { ...initTable, ...accTable }
    }

    const tableProps = {
      initTable,
      accTable,
      store
    }

    const queueProps =  {
      queue,
      selected,
      modules,
      store
    }

    const paramProps = {
      module: queue[selected],
      initTable,
      accTable,
      selected,
      store
    }

    return (
      <div style={[styles.main]}>
        <Crud {...crudProps} />
        <Json {...jsonProps} />
        <Preview {...previewProps} />
        <div style={[styles.row]}>
          <Table {...tableProps} />
          <Queue {...queueProps} />
          <Parameters {...paramProps} />
        </div>
      </div>
    )
  }
}

export default Container