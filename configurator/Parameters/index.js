import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import styles from './styles'
import CRUD from './CRUD'
import Excel from './Excel'
import load from '../../global/services/lazy'
import extractSchema from '../../global/services/extractSchema'

@Radium
export default class Params extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    if (this.props.params) {
      this.setDefaultProps.bind(this)(this.props)
    }
  }

  componentWillReceiveProps (props) {
    if (props.params && !this.props.params) {
      this.setDefaultProps.bind(this)(props)
    } else if (this.props.params) {
      const keys = _.keys(props.params)
      const oldKeys = _.keys(this.props.params)
      console.log(_.difference(oldKeys, keys), keys, oldKeys)
      if (_.difference(oldKeys, keys).length) {
        this.setDefaultProps.bind(this)(props)
      }
    }
  }

  setDefaultProps (props) {
    const { params, store, selected } = props
    const { defaultProps } = load(params.type)
    
    store.dispatch({
      type: 'SET_MODULE_PARAMS',
      selected,
      params: {
        ...params,
        ...defaultProps
      }
    })

    this.setState({
      schema: extractSchema(params)
    })
  }

  render () {
    const { schema } = this.state
    const {
      initTable,
      accTable,
      params,
      hidden,
      selected,
      store
    } = this.props

    const style = { 
      flex: 2,
      display: hidden ? 'none' : 'auto'
    }

    return (
      <div style={[styles.col, style]}>
      {
        params &&
        <div>
          <div style={[styles.heading]}>Module {selected} (type: {params.type}) parameters</div>
          <CRUD
            params={params}
            schema={schema}
            table={{ ...initTable, ...accTable}}
            excelCol={this.state.excelCol}
            setParams={(params) => {
              store.dispatch({
                type: 'CHANGE_MODULE_PARAMS',
                selected, 
                params
              })
            }}
          />
          <Excel
            setCol={excelCol => this.setState({ excelCol })}
          />
        </div>
      }
      </div>
    )
  }
}