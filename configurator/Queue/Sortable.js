import React from 'react'
import Radium from 'radium'
import { DragSource, DropTarget } from 'react-dnd'

const itemSource = {
  beginDrag (props) {
    return { id: props.id }
  }
}

const itemTarget = {
  hover (props, monitor) {
    const draggedId = monitor.getItem().id

    if (draggedId !== props.id) {
      props.move(draggedId, props.id)
    }
  }
}

@DropTarget('ITEM', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('ITEM', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@Radium
class Item extends React.Component {
  render() {
    const { text, id, select, remove, highlight, i, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1
    const backgroundColor = highlight ? '#77f' : null

    return connectDragSource(connectDropTarget(
      <li>
        <div
          style={[styles.item, { opacity, backgroundColor }]}
          onClick={() => {
            if (!isDragging) select(id)
          }}
        >
          <span>{i}. {text}</span>
        </div>
        <button
          onClick={() => remove(id)}
          style={{float:'right'}}
        >x</button>
      </li>
    ))
  }
}

@Radium
export default class Container extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { list, move, select, remove, selected } = this.props
    return (
      <ul style={[styles.list]}>
        {list.map((item, i) => {
          return (
            <Item 
              key={item.id}
              id={item.id}
              text={item.text}
              move={move}
              remove={remove}
              select={select}
              highlight={selected === i}
              i={i}
            />
          )
        })}
      </ul>
    )
  }
}

const styles = {
  list: {
    padding: 0
  },
  item : {
    margin: 5,
    padding: 5,
    boxSizing: 'border-box',
    listStyleType: 'none',
    cursor: 'grab',
    ':hover': {
      color: '#fff',
      backgroundColor: '#333'
    }
  }
}