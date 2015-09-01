import React from 'react'
import Radium from 'radium'

import Button from '../components/Button'

@Radium
class Queue extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: props.data || {} }
  }

  componentWillReceiveProps (props) {
    let current = props.data[props.index] || {}
    this.setState({
      table: Object.keys(current)
        .map((k) => [k, current[k]])
    })
  }

  render () {
    const { props, state } = this
    return (
      <div style={[styles.main]}>
        <div style={[]}>
          <select
            style={[styles.select]}
            value={props.index}
            onChange={(e) => {
              props.onSwitch(e.target.value)
            }}
          >
          {
            props.data.map((c, i) => {
              return <option value={i}>
                {i}: {c.type}
              </option>
            })
          }
          </select>
        </div>
        <table style={[styles.table]}>
          <tbody>
          {
            state.table &&
            state.table
              .map((a, i) => (
                <tr key={i}>
                  <td style={[styles.cell]}>
                    <input
                      type="text"
                      style={[styles.input]}
                      value={a[0]}
                    />
                  </td>
                  <td style={[styles.cell]}>
                    <input
                      type="text"
                      style={[styles.input]}
                      value={a[1]}
                      onChange={(e) => {
                        state.table[i][1] = e.target.value
                        this.setState({ table: state.table })
                      }}
                    />
                  </td>
                </tr>
              ))
          }
            <tr>
              <td></td>
              <td>
                <Button
                  text="Set"
                  modStyle={{ float: 'right' }}
                  handler={() => {
                    props.data[props.index] = _.object(state.table)
                    props.set(props.data)
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const styles = {
  table: {
    fontFamily: 'Courier',
    fontSize: '0.75em',
    borderSpacing: 0,
    marginTop: 60
  },
  cell: {
    borderTop: '1px solid #333',
    padding: '0.5rem',
    margin: 0,
    width: '50%'
  },
  input: {
    fontFamily: 'Courier',
    backgroundColor: '#ffe',
    fontSize: '1em',
    border: 'none',
    width: '100%'
  },
   select: {
    margin: '0.5rem'
  } 
}

export default Queue