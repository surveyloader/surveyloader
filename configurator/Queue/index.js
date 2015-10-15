import React from 'react'
import Radium from 'radium'
import styles from './styles'

import modules from '../../modules/list.json'

import Sortable from './Sortable'

@Radium
export default class Queue extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.props.store.dispatch({
      type: 'SET_MODULE_LIST',
      modules
    })

    this.setState({
      selectedModule: modules[0]
    })
  }

  render () {
    const {
      queue,
      selected,
      modules,
      store
    } = this.props

    return (
      <div style={[styles.col]}>
        <div>
          <div style={[styles.heading]}>Module queue</div>
          <Sortable
            list={queue.map((m) => {
              return { ...m, text: `type: ${m.type}` }
            })}
            move={(id, afterId) => {
              store.dispatch({ 
                type: 'MOVE_QUEUE_MODULE',
                id,
                afterId 
              })
            }}
            select={(id) => {
              store.dispatch({
                type: 'SELECT_QUEUE_MODULE',
                id
              })
            }}
            selected={selected}
            remove={(id) => {
              store.dispatch({
                type: 'REMOVE_QUEUE_MODULE',
                id
              })
            }}
          />
          <select
            onChange={e => {
              console.log(e.target.value)
              this.setState({
                selectedModule: e.target.value
              })
            }}
          >
          {
            modules.map((m, i) => (
              <option
                value={m}
                key={i}
              >{m}</option>
            ))
          }
          </select>
          <input
            style={{ float: 'right' }}
            type="button"
            value="Add module"
            onClick={() => {
              store.dispatch({
                type: 'ADD_QUEUE_MODULE',
                module: this.state.selectedModule
              })
            }}
          />
        </div>
      </div>
    )
  }
}