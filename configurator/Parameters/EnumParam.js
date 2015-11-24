import React from 'react'
import Radium from 'radium'
import { omit } from 'lodash'
import styles from './styles'
import Parameterize from './Parameterize'

export default Radium((props) => {
  const { name, types, schema, value, set } = props
  const defaultType = value ? value.type : Object.keys(types)[0]
  // if (!value) {
  //   set({ type: Object.keys(types)[0] })
  // }
  return (
    <div style={[styles.col]}>
      <div style={[styles.row, { justifyContent: 'flex-start' }]}>
        <select
          onChange={(e) => set({ ...value, type: e.target.value })}
          defaultValue={value ? defaultType : Object.keys(types)[0]}
        >
        {
          Object.keys(types).map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))
        }
        </select>
      </div>
      <div style={[styles.row]}>
      {
        <Parameterize
          {...props}
          schema={types[defaultType].schema}
          set={(v) => set({ ...v, type: defaultType })}
          value={omit(value, 'type') || {}}
        />
      }
      </div>
    </div>
  )
})