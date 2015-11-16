import React from 'react'
import Radium from 'radium'
import styles from './styles'

import Loader from './Loader'

@Radium
export default class Preview extends React.Component {
  render () {
    const {
      module,
      table,
      fullscreen
    } = this.props

    const embedded = (
      <div style={{ width: '100%' }}>
        <div style={[styles.heading]}>Module preview</div>
        <div style={[styles.preview]}>
        {
          module ?
          <Loader
            params={module}
            table={table}
            push={(table) => {}}
          /> :
          <div style={[styles.col, { justifyContent: 'center', textAlign: 'center' }]}>
            <div style={[{ flex: 1 }]}>* select survey *</div>
          </div>
        }
        </div>
      </div>
    )

    const full = (
      <div style={[styles.main]}>
        <div style={[styles.container]}>
        {
          module ?
          <Loader
            params={module}
            table={table}
            push={(table) => {}}
          /> :
          <div style={[styles.col, { justifyContent: 'center', textAlign: 'center' }]}>
            <div style={[{ flex: 1 }]}>* module not found *</div>
          </div>
        }
        </div>
      </div>
    )

    return fullscreen ?
      full :
      embedded
  }
}