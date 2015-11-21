import React from 'react'
import Radium from 'radium'
import gstyles from '../styles'

const styles = {
  ...gstyles,
  row: {
    ...gstyles.row,
    ...gstyles.padding(1),
    justifyContent: 'center'
  },
  item: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    ...gstyles.padding(0, 1)
  }
}

export default Radium(({ type, caption, options, handler }) => {
  switch (type) {
    case 'TextField':
      return (
        <div style={[styles.row]}>
          <span style={[styles.item]}>
            {caption}
          </span>
          <input
            type="text"
            style={{ flex: 2 }}
            onChange={(v) => handler(v)}
          />
        </div>
      )

    default:
      return (
        <div></div>
      )
  }
})