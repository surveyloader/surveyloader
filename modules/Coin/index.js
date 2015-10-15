import React, { PropTypes } from 'react'

class Coin extends React.Component {
  static simulate () {
    return {
      coin: Math.random() > 0.5 ? -1 : 1
    }
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.props.push({
      coin: Math.random() > 0.5 ? -1 : 1
    })
  }

  render () { return <div></div> }
}

export default Coin