import React, { PropTypes } from 'react'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import identify
from '../../../global/services/stringHash'
import ColorScheme from '../../../global/services/colorScheme'

class Sample extends React.Component {
  static propTypes = {
    aspects: PropTypes.array.isRequired,
    bucket: PropTypes.string.isRequired,
    n: PropTypes.number
  }

  choose (n, aspects, bucket = 'a') {
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

  constructor (props) {
    super(props)
    const { push, n, aspects, bucket } = props
    push(this.choose(n, aspects, bucket))
  }

  render () { return <div></div> }
}

export default Sample