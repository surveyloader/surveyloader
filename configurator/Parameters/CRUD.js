import React, { PropTypes } from 'react'
import Radium  from 'radium'
import _ from 'lodash'

import load from '../../global/services/lazy'
import echo from '../../global/services/echo'

import Parameterize from './Parameterize'

@Radium
class CRUD extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hover: null }
  }

  componentDidMount () {
    this.props.setParams(this.props.params)
  }

  componentDidUpdate (prevProps) {
    const { params, setParams } = this.props
    if (!_.isEqual(params, prevProps.params)) {
      setParams(params)
    }
  }

  setParam (param, value) {
    console.log('set', param, value)
    this.props.setParams({
      ...this.props.params,
      [param]: value
    })
  }

  render () {
    const { hover } = this.state
    const {
      table,
      params,
      schema,
      excelCol
    } = this.props

    return (
      <div
        style={[styles.col]}
        onMouseOut={() => this.setState({ hover: null })}
      >
      {
        !!Object.keys(schema).length &&
        Object.keys(schema)
          .map((p, i) => (
            <Parameterize
              key={i}
              name={p}
              value={params[p]}
              schema={schema[p]}
              table={table}
              hover={hover === i}
              onHover={() => this.setState({ hover: i })}
              set={(val) => ::this.setParam(p, val)}
              excelCol={excelCol}
            />
          ))
      }
      </div>
    )
  }
}

const styles = {
  col: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '0 0.5rem'
  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: '0.5rem 0'
  },
  hover: { 
    width: '100%',
    whiteSpace: 'wrap'
  },
  label: {
    textAlign: 'right',
    verticalAlign: 'top',
    flex: 0.5
  },
  input: {
    width: '100%'
  }
}

export default CRUD