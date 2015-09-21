import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { DragSource } from 'react-dnd'

import Button from '../components/Button'

const itemSource = {
  beginDrag (props) {
    return { param: '$' + props.k }
  }
}

@DragSource('TABLE_PARAM', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
class TableParameter extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { k, v, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0 : 1
    return connectDragSource(
      <div style={[styles.row, { opacity }]}>
        <div style={[styles.col, { textAlign: 'right' }]}>
          <span>{k}:</span>
        </div>
        <div style={[styles.col, { flex: 2 }]}>
          <span>{v}</span>
        </div>
      </div>
    )
  }
}

@Radium
class Table extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { data } = this.props
    return (
      <div>
      {
        data &&
        _.map(data, (v, k) => (
            <TableParameter
              key={k}
              k={k}
              v={v}
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
  }
}

export default Table