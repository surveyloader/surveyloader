import React from 'react'
import Radium from 'radium'
import styles from './styles'

import CrudTable from './CrudTable'

@Radium
export default class Json extends React.Component {
  render () {
    const {
      initTable,
      accTable,
      store
    } = this.props

    return (
      <div style={[{ flex: 2 }]}>
        <div>
          <div style={{width: '100%'}}>
            <div style={[styles.heading]}>Initial table</div>
            <CrudTable
              data={initTable}
              edit={true}
              set={(newTable) => {
                store.dispatch({
                  type: 'SET_INIT_TABLE',
                  table: newTable
                })
              }} 
            />
          </div>
        </div>
        <div>
        {
          !!Object.keys(accTable).length &&
          <div style={{ width: '100%' }}>
            <div style={[styles.heading]}>Accumulating table</div>
            <CrudTable
              data={accTable}
              edit={true}
              set={(newTable) => {
                store.dispatch({
                  type: 'SET_ACC_TABLE',
                  table: newTable
                })
              }} 
            />
          </div>
        }
        </div>
      </div>
    )
  }
}