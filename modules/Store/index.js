import React, { PropTypes } from 'react'
import _ from 'lodash'
import http from 'superagent'

class Store extends React.Component {
  static propTypes = {
    blacklist: PropTypes.array,
    surveyName: PropTypes.string,
    surveyVersion: PropTypes.string,
    thanks: PropTypes.string
  }

  static defaultProps = {
    blacklist: [],
    surveyName: '$surveyName',
    surveyVersion: '$surveyVersion',
    thanks: 'Thank you!'
  }

  static simulate (props) {
    return null
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { table, surveyName, surveyVersion } = this.props
    http
      .post(`https://surveyloader.firebaseio.com/responseData/${surveyName}/${surveyVersion}.json`)
      .send({
        ...table,
        received: {
          '.sv': 'timestamp'
        }
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        console.log(err, res)
      })
  }

  render () { 
    return (
      <div>
        <h1>{this.props.thanks}</h1>
      </div>
    )
  }
}

export default Store