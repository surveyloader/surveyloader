import React from 'react'
import Radium from 'radium'
import http from 'superagent'
import Markdown from 'react-remarkable'

import styles from './styles'

@Radium
class Doc extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    http
      .get(`/${this.props.path}/README.md`)
      .end((err, res) => {
        this.setState({ md: res.text })
      })
  }

  componentWillReceiveProps (props) {
    http
      .get(`/${props.path}/README.md`)
      .end((err, res) => {
        this.setState({ md: res.text })
      })
  }

  render () {
    return (
      <div style={[styles.doc]}>
        <Markdown source={this.state.md} />
      </div>
    )
  }
}

export default Doc