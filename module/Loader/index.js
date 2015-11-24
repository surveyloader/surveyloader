import React, { PropTypes } from 'react'
import _ from 'lodash'

import load from '../../global/services/lazy'
import echo from '../../global/services/echo'

class Loader extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    table: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { component: null }
    this.loadComponent = this.loadComponent.bind(this)
  }

  loadComponent (params, table) {
    console.log('load', params)
    if (params.type) {
      const component = load(params.type)
      component.defaultProps = component.defaultProps ? component.defaultProps : {}
      
      const paramValues = _(params)
        .map((v, p) => {
          return Array.isArray(v) ?
            [p, v.map(subv => echo(subv, table))] :
            [p, echo(v, table)]
        })
        .object()
        .value()

      component.defaultProps = { ...component.defaultProps, ...paramValues }
      this.setState({ component })
    }
  }

  componentDidMount () {
    const { params, table } = this.props
    this.loadComponent(params, table)
  }

  componentWillReceiveProps (nextProps) {
    const { params, table } = nextProps
    this.setState({ component: null, response: null }, () => {
      this.loadComponent(params, table)
    })
  }

  render () {
    const Component = this.state.component
    const { response } = this.state

    if (Component && !response) {
      return (
        <Component
          {...this.props}
          push={(response) => this.setState({ response })}
        />
      )
    } else if (response) {
      return <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
    } else {
      return <span>...</span>
    }
  }
}

export default Loader