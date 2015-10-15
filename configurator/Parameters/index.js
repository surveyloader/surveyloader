import React from 'react'
import Radium from 'radium'
import styles from './styles'

import CrudParams from './CrudParams'

@Radium
export default class Json extends React.Component {
  render () {
    const {
      initTable,
      accTable,
      module,
      selected,
      store
    } = this.props

    return (
      <div style={[styles.col, { flex: 2 }]}>
      {
        module &&
        <div>
          <div style={[styles.heading]}>Module {selected} (type: {module.type}) parameters</div>
          <CrudParams
            module={module}
            table={{ ...initTable, ...accTable}}
            setParams={(params) => {
              store.dispatch({
                type: 'CHANGE_MODULE_PARAMS',
                params
              })
            }}
          />
        </div>
      }
      </div>
    )
  }
}