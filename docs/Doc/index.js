import React, { DOM, createFactory as $ } from 'react'
import Radium from 'radium'
import http from 'superagent'
import Markdown from 'react-remarkable'

import styles from './styles'

@Radium
class Doc extends React.Component {
  constructor (props) {
    super(props)
  }

  loadDocumentation (path) {
    http
      .get(`/${path}/README.md`)
      .end((err, res) => {
        if (!err) {
          this.setState({ md: res.text })
        } else {
          this.setState({ md: '*No documentation found for this module*' })
        }
      })
  }

  componentWillMount () {
    this.loadDocumentation(this.props.path)
  }

  componentWillReceiveProps (props) {
    this.loadDocumentation(props.path)
  }

  render () {
    return DOM.div({
      style: [styles.doc],
      children: [
        $(Markdown)({ source: this.state.md })
      ]
    })
  }
}

export default Doc