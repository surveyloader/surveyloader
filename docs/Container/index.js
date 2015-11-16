import React from 'react'
import Radium from 'radium'

import styles from './styles'

import Doc from '../Doc'
import Modules from '../Modules'

@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={[styles.main]}>
        <h2 style={{color: '#ccc'}}>
          Survey Loader Documentation
        </h2>
        <Doc path="run" />
        <Doc path="configurator" />
        <Doc path="simulator" />
        <Doc path="data" />
        <Modules />
      </div>
    )
  }
}

export default Container