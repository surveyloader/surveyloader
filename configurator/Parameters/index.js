import React from 'react'
import Radium from 'radium'
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
    this.setDefaultProps.bind(this)(this.props)
  }

  componentWillReceiveProps (props) {
    if (props.params.type !== this.props.params.type) {
      this.setDefaultProps.bind(this)(props)
    }
  }

  setDefaultProps (props) {
    const { params, store } = props
    const { defaultProps } = load(params.type)
    
    store.dispatch({
      type: 'CHANGE_MODULE_PARAMS',
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