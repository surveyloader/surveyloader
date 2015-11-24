import React from 'react'
import Radium from 'radium'
import Parameterize from './Parameterize'
import styles from './styles'

@Radium
class ArrayParam extends React.Component {
  render () {
    const {
      name,
      value,
      elementSchema,
      excelCol,
      set
    } = this.props
    
    return (
      <div style={[styles.row]}>
        <div style={[styles.col, styles.label]}>
          <span>{name} (<i>array</i>):</span>
        </div>
        <div style={[styles.col]}>
          {
            !!value.length &&
            value.map((v, i) => (
              <div style={[styles.row]}>
                <Parameterize
                  {...this.props}
                  schema={elementSchema}
                  name={i}
                  value={v}
                  set={val => {
                    value[i] = val
                    set(value)
                  }}
                />
                <button onClick={() => set(value.slice(0,i).concat(value.slice(i + 1)))}>
                  X
                </button>
              </div>
            ))
          }
          <div style={[styles.row, { background: 'rgba(200, 255, 200, 0.5)' }]}>
            <Parameterize
              {...this.props}
              schema={elementSchema}
              name={value.length}
              value={this.state.pendingElement}
              set={val => this.setState({ pendingElement: val })}
            />
          </div>
          <div style={[styles.row, { background: 'rgba(200, 255, 200, 0.5)' }]}>
          {
            this.state.pendingElement &&
            <button
              onClick={() => {
                set(value.concat(this.state.pendingElement))
                this.setState({ pendingElement: null })
              }}
            >Add to array</button>
          }
          </div>
          <div style={[styles.row, { background: 'rgba(127, 255, 127, 0.8)' }]}>
          {
            excelCol &&
            <input
              type="button"
              value="Add selected Excel column"
              onClick={() => {
                set(value.concat(excelCol))
              }}
            />
          }
          </div>
        </div>
      </div>
    )
  }
}

export default ArrayParam