import React, { PropTypes } from 'react'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import identify
from '../../../global/services/stringHash'
import ColorScheme from '../../../global/services/colorScheme'

function choose (n, aspects, bucket) {
  let colors = []
  let samples = _(aspects)
    .sample(n || aspects.length)
    .map((p, i) => {
      colors.push([
        identify(p) + '_color',
        ColorScheme.index(i)
      ])
      return [
        `sample_${bucket}_` + i,
        p
      ]
    })
    .value()

  return _.object(samples.concat(colors))
}

class Sample extends React.Component {
  static propTypes = {
    aspects: PropTypes.array,
    bucket: PropTypes.string,
    n: PropTypes.number
  }

  static defaultProps = {
    aspects: ['one','two'],
    bucket: 'a',
    n: 1
  }

  static simulate (props) {
    const { simulate, n, aspects, bucket } = props
    return choose(n, aspects, bucket)
  }

  constructor (props) {
    super(props)
    const { push, n, aspects, bucket } = props
    push(choose(n, aspects, bucket))
  }

  render () { return <div></div> }
}

export default Sample