import React from 'react'

class URLParams extends React.Component {
  static simulate (props) {
    return _(location.search.slice(1).split('&'))
      .map((item) => item.split('='))
      .object()
      .value()
  }

  componentWillMount () {
    const params = _(location.search.slice(1).split('&'))
      .map((item) => item.split('='))
      .object()
      .value()
    this.props.push(params)
  }

  render () {
    return (
      <div>
      </div>
    )
  }
}

export default URLParams