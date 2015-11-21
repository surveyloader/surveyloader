import React from 'react'
import Radium from 'radium'

import styles from './styles'

import Doc from '../Doc'

import modulesList from '../../modules/list.json'

@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.setState({ selected: modulesList[0] })
  }

  render () {
    const {
      selected
    } = this.state

    return (
      <div>
        <h2>
          Module types
        </h2>
        <p>
          See&nbsp;
          <a href="/module/">
            surveyloader.org/module
          </a>
          &nbsp;for interactive testing and screenshots across browser environments.
        </p>
        <select onChange={e => {
          this.setState({ selected: e.target.value })
        }}>
        {
          modulesList.map((m, i) => {
            return (
              <option
                key={i}
                value={m}
              >{m}</option>
            )
          })
        }
        </select>
        <Doc path={`modules/${selected}`} />
      </div>
    )
  }
}

export default Container