import React from 'react'
import Radium from 'radium'
import styles from './styles'

@Radium
export default class Json extends React.Component {
  render () {
    const { data } = this.props

    return (
      <div>
      {
        this.state.show ?
        <div>
          <div>
            <span>JSON&nbsp;</span>
            <button onClick={() => this.setState({ show: false })}>Hide</button>
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div> :
        <div>
          <span>JSON&nbsp;</span>
          <button onClick={() => this.setState({ show: true })}>Show</button>
        </div>
      }
      </div>
    )
  }
}