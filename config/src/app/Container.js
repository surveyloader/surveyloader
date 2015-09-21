import React from 'react'
import Radium from 'radium'
import http from 'superagent'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'

import store from '../stores'
import Table from './Table'
import Queue from './Queue'
import LoadParams from './LoadParams'
import Preview from './Preview'

import simulateOver from '../../../load/src/services/simulateOver'

import Sortable from '../components/Sortable'

@DragDropContext(HTML5Backend)
@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })

    http
      .get('https://fsurvey.firebaseio.com/configs.json')
      .end((err, res) => {
        store.dispatch({
          type: 'SET_SURVEY_LIST',
          surveys: res.body
        })
      })

    http
      .get('/folding-survey/static/list.json')
      .end((err, res) => {
        store.dispatch({
          type: 'SET_MODULE_LIST',
          modules: res.body
        })
      })
  }

  shouldComponentUpdate (newProps, newState) {
    const { selected, startingTable, queue } = this.state
    if (newState.selected !== selected) {
      simulateOver(startingTable, queue.slice(0, newState.selected))
        .then(table => {
          console.log(table)
          store.dispatch({ type: 'SET_TABLE', table })
        })
      return false
    }
    return true
  }

  render () {
    const { surveys, modules, queue, table, selected, params } = this.state
    console.log(queue[selected], params)
    return (
      <div style={[styles.main]}>
        <div style={[styles.row, { flex: 0.125 }]}>
          <p>
            survey:&nbsp;
            <select
              defaultValue={null}
              onChange={(e) => {
                let v = Object
                  .keys(surveys[e.target.value])
                  .reverse()[0]
                store.dispatch({
                  type: 'SELECT_SURVEY',
                  survey: surveys[e.target.value][v]
                })
              }}
            >
            {
              Object.keys(surveys)
                .map((name, i) => {
                  return (
                    <option
                      key={i}
                      value={name}
                    >
                      {name}
                    </option>
                  )
                })
            }
            </select>
            &nbsp;version: 
          </p>
        </div>
        <div style={[styles.row, { width: '100%' }]}>
          <div style={{ width: '100%' }}>
            <div style={[styles.heading]}>Module preview</div>
            <div style={[styles.preview]}>
            {
              !!Object.keys(params).length ?
              <Preview
                params={{...queue[selected], ...params}}
                table={table}
                push={(table) => {}}
              /> :
              <div style={[styles.col, { justifyContent: 'center', textAlign: 'center' }]}>
                <div style={[{ flex: 1 }]}>* select survey *</div>
              </div>
            }
            </div>
          </div>
        </div>
        <div style={[styles.row]}>
          <div style={[styles.col, { flex: 2 }]}>
          {
            !!Object.keys(table).length &&
            <div>
              <div style={[styles.heading]}>Accumulating table</div>
              <Table
                data={table}
                set={(newTable) => {
                  store.dispatch({
                    type: 'SET_TABLE',
                    table: newTable
                  })
                }} 
              />
            </div>
          }
          </div>
          <div style={[styles.col]}>
          { 
            !!queue.length &&
            <div>
              <div style={[styles.heading]}>Module queue</div>
              <Sortable
                list={queue.map((m) => {
                  return { ...m, text: `type: ${m.type}` }
                })}
                move={(id, afterId) => {
                  store.dispatch({ 
                    type: 'MOVE_QUEUE_MODULE',
                    id,
                    afterId 
                  })
                }}
                select={(id) => {
                  store.dispatch({
                    type: 'SELECT_QUEUE_MODULE',
                    id
                  })
                }}
                selected={selected}
                remove={(id) => {
                  store.dispatch({
                    type: 'REMOVE_QUEUE_MODULE',
                    id
                  })
                }}
              />
              <select ref="modules">
              {
                modules.map((m, i) => (
                  <option
                    value={m}
                    key={i}
                  >{m}</option>
                ))
              }
              </select>
              <input
                style={{ float: 'right' }}
                type="button"
                value="Add Module"
                onClick={() => {
                  store.dispatch({
                    type: 'ADD_QUEUE_MODULE',
                    module: this.refs.modules.value
                  })
                }}
              />
            </div>
          }
          </div>
          <div style={[styles.col, { flex: 2 }]}>
          {
            queue[selected] &&
            <div>
              <div style={[styles.heading]}>Module {selected} (type: {queue[selected].type}) parameters</div>
              <LoadParams
                module={{ ...queue[selected], ...params }}
                table={table}
                setParams={(params) => this.setState({ params })}
              />
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  main: {
    margin: '0 auto',
    width: '100%',
    minWidth: 640,
    maxWidth: 1200,
    minHeight: '100%',
    left: 0,
    top: 0,
    backgroundColor: '#fff',
    fontFamily: 'Courier',
    fontSize: '1em',
    color: '#333',
    boxSizing: 'border-box'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '1.125em',
    padding: '0.5rem'
  },
  col: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '0 0.5rem',
    padding: '0 0.5rem'
  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: '0.5rem 0'
  },
  preview: {
    boxSizing: 'border-box',
    minWidth: '100%',
    height: 600,
    margin: '0 auto',
    overflowY: 'scroll',
    fontFamily: 'Helvetica',
    fontSize: '1.25em',
    padding: 30,
    backgroundColor: '#ddf',
    border: '1em solid #000'
  }
}

export default Container