import React from 'react'
import Radium from 'radium'
import styles from './styles'

import CrudParams from './CrudParams'
import Excel from './Excel'

@Radium
export default class Params extends React.Component {
  render () {
    const {
      initTable,
      accTable,
      module,
      hidden,
      selected,
      store
    } = this.props

    const style = { 
      flex: 2,
      display: hidden ? 'none' : 'auto'
    }

    return (
      <div style={[styles.col, style]}>
      {
        module &&
        <div>
          <div style={[styles.heading]}>Module {selected} (type: {module.type}) parameters</div>
          <CrudParams
            module={module}
            table={{ ...initTable, ...accTable}}
            col={this.state.col}
            setParams={(params) => {
              store.dispatch({
                type: 'CHANGE_MODULE_PARAMS',
                params
              })
            }}
          />
          <Excel
            setCol={col => this.setState({ col })}
          />
        </div>
      }
      </div>
    )
  }
}