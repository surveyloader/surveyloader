import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { DragSource } from 'react-dnd'

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
    const { k, v, edit, set, remove, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0 : 1
    return connectDragSource(
      <div style={{ opacity }}>
        <span style={{ color: '#42f' }}>{k}:</span>
        {
          edit ?
          <span>
            <input
              type="text"
              defaultValue={v}
              onChange={(e) => set(e.target.value)}
            />
            <input
              type="button"
              value="x"
              onClick={remove}
            /> 
          </span> :
          <span>{String(v)}</span>
        }
      </div>
    )
  }
}

@Radium
class CrudTable extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { data, set, edit } = this.props
    return (
      <div>
        <div>
        {
          edit &&
          <div style={[styles.row]}>
            <div style={[styles.col, { textAlign: 'right' }]}>
              <input
                type="text"
                style={[styles.hundred]}
                ref="k"
              />
            </div>
            <div style={[styles.col, { flex: 2 }]}>
              <input
                type="text"
                style={[styles.hundred]}
                ref="v"
              />
            </div>
            <div style={[styles.col, { flex: 0.2 }]}>
              <input
                type="button"
                value="+"
                onClick={() => {
                  set({
                    ...data,
                    [this.refs.k.value]: this.refs.v.value
                  })
                }}
              />
            </div>
          </div>
        }
        </div>
        <div>
        {
          data &&
          Object.keys(data)
            .sort()
            .map((k) => (
              <TableParameter
                key={k}
                k={k}
                v={data[k]}
                edit={edit}
                set={(v) => set({ ...data, [k]: v })}
                remove={() => {
                  delete data[k]
                  set(data)
                }}
              />
            ))
        }
        </div>
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
  },
  hundred: {
    width: '100%'
  }
}

export default CrudTable