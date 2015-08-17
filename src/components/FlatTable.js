import React from 'react'
import Radium from 'radium'

@Radium
class FlatTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: props.data || {} }
  }

  componentWillReceiveProps (props) {
    this.setState({ data: props.data })
  }

  render () {
    const { set } = this.props
    const { data } = this.state
    return (
      <table style={[styles.table]}>
        <tbody>
        {
          data &&
          Object.keys(data)
            .map((k) => (
              <tr>
                <td>{k}:</td>
                <td>
                  <input
                    style={[styles.input]}
                    type="text"
                    value={data[k]}
                    onChange={(event) => {
                      let newTable = {
                        ...data,
                        [k]: event.target.value
                      }
                      this.setState({
                        data: newTable
                      })
                      set(newTable)
                    }}
                  />
                </td>
              </tr>
            ))
        }
        </tbody>
      </table>
    )
  }
}

const styles = {
  table: {
    fontFamily: 'Courier',
    fontSize: '0.75em',
    borderColor: '#fff',
    borderSpacing: '0.5rem'
  },
  input: {
    width: 1000,
    fontFamily: 'Courier',
    fontSize: '1em',
    color: '#333',
    background: '#000',
    border: 'none'
  }
}

export default FlatTable