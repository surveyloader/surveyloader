import React, { PropTypes } from 'react'
import Radium  from 'radium'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import load from '../../global/services/lazy'
import echo from '../../global/services/echo'
import styles from './styles'

const itemTarget = {
  drop (props, monitor) {
    const draggedParam = monitor.getItem().param
    props.set(draggedParam)
  }
}

@DropTarget('TABLE_PARAM', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@Radium
class HoverableInput extends React.Component {
  render () {
    const {
      table,
      value,
      set,
      hover,
      brush,
      connectDropTarget
    } = this.props

    return connectDropTarget(
      <div style={[styles.hover]}>
        <input
          type="text"
          value={value}
          onChange={(e) => set(e.target.value)}
          onBrush={brush}
          style={{ width: '100%' }}
        />
        {
          /\$.+/.test(value) &&
          <span>-> {echo(value, table)}</span>
        }
      </div>
    )
  }
}

@Radium
class LeafParam extends React.Component {
  render () {
    const {
      table,
      schema,
      name,
      value,
      set,
      remove,
      onHover,
      hover
    } = this.props

    return (
      <div style={[styles.row]} onMouseOver={onHover}>
        <div style={[styles.col, styles.label]}>
          <span>{name} (<i>{schema[0]}</i>):</span>
        </div>
        <div style={[styles.col]}>
          <HoverableInput
            table={table}
            value={value}
            set={set}
            hover={hover}
            brush={onHover}
          />
        </div>
      </div>
    )
  }
}

export default LeafParam