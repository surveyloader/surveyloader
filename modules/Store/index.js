import React from 'react'
import { declare, type } from '../../global/types'
import _ from 'lodash'
import http from 'superagent'

class Store extends React.Component {
  static propTypes = {
    blacklist: declare(type.array),
    surveyName: declare(type.string),
    surveyVersion: declare(type.string),
    thanks: declare(type.string)
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