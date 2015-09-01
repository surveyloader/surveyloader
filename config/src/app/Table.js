import React from 'react'
import Radium from 'radium'

import Button from '../components/Button'

@Radium
class Table extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: props.data || {} }
  }

  componentWillReceiveProps (props) {
    this.setState({
      table: Object.keys(props.data)
        .map((k) => [k, props.data[k]])
    })
  }

  render () {
    const { props, state } = this
    return (
      <div style={[styles.main]}>
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
    fontSize: '1em',
    background: '#ffe',
    border: 'none',
    width: '100%'
  }
}

export default Table