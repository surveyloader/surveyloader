import React, { PropTypes } from 'react'
import _ from 'lodash'
import load from '../util/lazy'

class Loader extends React.Component {
  static propTypes = {
    specs: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { component: null }
    this.loadComponent.bind(this)
  }

  loadComponent (specs, table) {
    if (specs.type) load(specs.type).then((component) => {
      if (!component.defaultProps) component.defaultProps = {}
      for (let p in component.propTypes) {
        // check for $keys$$
        if (/\$.+?\$\$/.test(p)) {
          let keyName = p.replace(/(\$(.+?)\$\$.+)/, '$2')
          let re = new RegExp('\\$' + keyName + '\\d+\\$')
          for (let s in specs) {
            if (re.test(s)) {
              let propName = p.replace(/(\$.+?\$\$)/, s)
              let key = p.replace(/(\$.+?\$\$)/, specs[s])
              if (table[key]) {
                component.defaultProps[propName] = table[key]
              }
            }
          }
        } else {
          let key = p
            .replace(/(\$.+?\$)/g, (m) => specs[m])
          if (table[key]) {
            component.defaultProps[p] = table[key]
          }
        }
      }
      this.setState({ 
        component
      })
    })
  }

  componentDidMount () {
    const { specs, table } = this.props
    this.loadComponent(specs, table)
  }

  componentWillReceiveProps (nextProps) {
    const { index, specs, table } = nextProps
    let tableDiff = !_.isEqual(table, this.props.table)
    let specsDiff = !_.isEqual(specs, this.props.specs)
    if (index !== this.props.index || tableDiff || specsDiff) {
      this.setState({ component: null })
      this.loadComponent(specs, table)
    }
  }

  render () {
    const Component = this.state.component
    console.log(Component, 'render')
    return Component &&
    <Component {...this.props} />
  }
}

export default Loader