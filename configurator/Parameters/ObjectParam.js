import React from 'react'
import Radium from 'radium'
import Parameterize from './Parameterize'
import { map } from 'lodash'
import styles from './styles'

@Radium
class ObjectParam extends React.Component {
  render () {
    const {
      name,
      value,
      propertySchemas,
      excelCol,
      set
    } = this.props
    
    return (
      <div style={[styles.row]}>
        <div style={[styles.col, styles.label]}>
          <span>{name} (<i>object</i>):</span>
        </div>
        <div style={[styles.col]}>
        {
          map(propertySchemas, (v, k) => (
            <div style={[styles.row]}>
              <Parameterize
                {...this.props}
                schema={propertySchemas[k].schema}
                name={k}
                value={value[k] || null}
                set={val => set({ ...value, [k]: val })}
              />
            </div>
          ))
        }
        </div>
      </div>
    )
  }
}

export default ObjectParam