import React, { PropTypes } from 'react'

class Coin extends React.Component {
  static simulate () {
    return {
      coin: Math.random() > 0.5
    }
  }

  constructor (props) {
    super(props)
    props.push({
      coin: Math.random() > 0.5
    })
  }

  render () { return <div></div> }
}

export default Coin