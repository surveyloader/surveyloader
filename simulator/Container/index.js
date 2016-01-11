import React from 'react'
import Radium from 'radium'
import styles from './styles'
import http from 'superagent'
import store from '../store'
import Crud from '../Crud'
import simulateOver from '../../global/services/simulateOver'
import identify from '../../global/services/stringHash'


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
      simulateOver(initTable, queue.slice(0, newState.selected))
        .then(table => {
          store.dispatch({
            type: 'SET_ACC_TABLE',
            table: _.omit(table, (v, k) => _.has(initTable, k))
          })
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
      selected,
      keys,
      data
    } = this.state

    const crudProps = {
      info,
      auth,
      initTable,
      queue,
      store,
      surveys,
      surveyName,
      surveyVersion,
      keys,
      data
    }

    return (
      <div style={[styles.main]}>
        <Crud {...crudProps} />
      </div>
    )
  }
}

export default Container