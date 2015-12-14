import React from 'react'
import _ from 'lodash'
import { declare, type } from '../../global/types'
import identify from '../../global/services/stringHash'
import ColorScheme from '../../global/services/colorScheme'

function choose (n, aspects, bucket) {
  return _.object(
      _.sample(aspects, n || 3)
      .map((p, i) => [
        [`aspect_${bucket}_${i}`, identify(p)],
        [`text_${identify(p)}`, p],
        [`color_${identify(p)}`, ColorScheme.index(i)]
      ])
      .reduce((a, b) => a.concat(b))
    )
}

class Sample extends React.Component {
  static propTypes = {
    aspects: declare(type.array),
    bucket: declare(type.string),
    n: declare(type.number)
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
  }

  componentWillMount () {
    const { push, n, aspects, bucket } = this.props
    push(choose(n, aspects, bucket))
  }

  render () { return <div></div> }
}

export default Sample