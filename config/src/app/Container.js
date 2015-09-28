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

    this.loadSurveys()
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
    const { selected, initTable, queue } = this.state
    if (newState.selected !== selected) {
      simulateOver(initTable, queue.slice(0, newState.selected))
        .then(table => {
          store.dispatch({ 
            type: 'SET_ACC_TABLE',
            table: _.omit(table, (v, k) => _.has(initTable, k))
          })
        })
      return false
    }
    return true
  }

  loadSurveys () {
    http
      .get('https://fsurvey.firebaseio.com/configs.json')
      .end((err, res) => {
        store.dispatch({
          type: 'SET_SURVEY_LIST',
          surveys: res.body
        })
      })
  }

  saveSurvey () {
    const { info, initTable, queue } = this.state
    http
      .post(`https://fsurvey.firebaseio.com/configs/${this.refs.name.value}.json`)
      .set('Accept', 'application/json')
      .send({
        info: {
          ...info,
          author: this.refs.author.value,
          modified: {
            '.sv': 'timestamp'
          }
        },
        table: initTable,
        queue: queue.length ? queue : null
      })
      .end((err, res) => {
        console.log(err, res)
        this.loadSurveys()
      })
  }

  render () {
    const {
      modules,
      surveys,
      surveyName,
      surveyVersion,
      info,
      queue,
      initTable,
      accTable,
      selected,
      params
    } = this.state
    return (
      <div style={[styles.main]}>
        <div style={[styles.row, { flex: 0.125 }]}>
          <span>Survey:</span>
          <select onChange={(e) => {
            store.dispatch({
              type: 'SELECT_SURVEY_NAME',
              surveyName: e.target.value
            })
          }}>
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
          </select>&nbsp;
          <span>Version:</span>
          <select onChange={(e) => {
            store.dispatch({
              type: 'SELECT_SURVEY_VERSION',
              surveyVersion: e.target.value
            })
          }}>
          {
            surveyName && Object.keys(surveys[surveyName])
              .reverse()
              .map((v, i) => {
                return (
                  <option
                    key={i}
                    value={v}
                  >
                    {Date(surveys[surveyName][v].info.modified)}
                  </option>
                )
              })
          }
          </select>&nbsp;
          <input
            type="button"
            value="Load"
            onClick={() => {
              store.dispatch({
                type: 'LOAD_SURVEY',
                survey: surveys[surveyName][surveyVersion]
              })
            }}
          />&nbsp;
          <input
            type="button"
            value="Create new"
            onClick={() => {
              store.dispatch({
                type: 'CREATE_SURVEY'
              })
            }}
          />
        </div>
        <div style={[styles.row, { flex: 0.125 }]}>
          <span>name:</span>
          <input
            type="text"
            ref="name"
            key={surveyName}
            defaultValue={surveyName}
          />&nbsp;
          <span>author:</span>
          <input
            type="text"
            ref="author"
            key={info.author || 'author'}
            defaultValue={info.author}
          />&nbsp;
          <input
            type="button"
            value="Save"
            onClick={::this.saveSurvey}
          />
        </div>
        <div style={[{ width: '100%' }]}>
          <div>
            {
              this.state.showJson ?
              <div>
                <div>
                  <span>Survey configuration JSON&nbsp;</span>
                  <button onClick={() => this.setState({ showJson: false })}>Hide</button>
                </div>
                <pre>{JSON.stringify({ info, table: initTable, queue }, null, 2)}</pre>
              </div> :
              <div>
                <span>Survey configuration JSON&nbsp;</span>
                <button onClick={() => this.setState({ showJson: true })}>Show</button>
              </div>
            }
          </div>
          <div style={{ width: '100%' }}>
            <div style={[styles.heading]}>Module preview</div>
            <div style={[styles.preview]}>
            {
              params ?
              <Preview
                params={{...queue[selected], ...params}}
                table={{ ...initTable, ...accTable}}
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
          <div style={[{ flex: 2 }]}>
            <div>
              <div style={{width: '100%'}}>
                <div style={[styles.heading]}>Initial table</div>
                <Table
                  data={initTable}
                  edit={true}
                  set={(newTable) => {
                    store.dispatch({
                      type: 'SET_INIT_TABLE',
                      table: newTable
                    })
                  }} 
                />
              </div>
            </div>
            <div>
            {
              !!Object.keys(accTable).length &&
              <div style={{ width: '100%' }}>
                <div style={[styles.heading]}>Accumulating table</div>
                <Table
                  data={accTable}
                  set={(newTable) => {
                    store.dispatch({
                      type: 'SET_ACC_TABLE',
                      table: newTable
                    })
                  }} 
                />
              </div>
            }
            </div>
          </div>
          <div style={[styles.col]}>
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
                value="Add module"
                onClick={() => {
                  store.dispatch({
                    type: 'ADD_QUEUE_MODULE',
                    module: this.refs.modules.value
                  })
                }}
              />
            </div>
          </div>
          <div style={[styles.col, { flex: 2 }]}>
          {
            queue[selected] &&
            <div>
              <div style={[styles.heading]}>Module {selected} (type: {queue[selected].type}) parameters</div>
              <LoadParams
                module={queue[selected]}
                params={params}
                table={{ ...initTable, ...accTable}}
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