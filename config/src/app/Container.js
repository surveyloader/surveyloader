import React from 'react'
import Radium from 'radium'
import http from 'superagent'
import store from '../stores'

import Loader from './Loader'
import Table from './Table'
import Queue from './Queue'

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
          type: 'SET_SURVEYS',
          surveys: res.body
        })
      })

    http
      .get('/folding-survey/static/list.json')
      .end((err, res) => {
        console.log(res.body)
        store.dispatch({
          type: 'SET_MODULE_LIST',
          modules: res.body
        })
      })
  }

  render () {
    const { surveys, modules, survey, index } = this.state
    const { info, queue, table } = survey
    return (
      <div style={[styles.main]}>
        <div style={[styles.row]}>
          <select
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
        </div>
        <div style={[styles.col]}>
          <h4>Accumulator Table</h4>
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
        <div style={[styles.col]} key="container">
          <h4>Module Queue</h4>
          <Queue
            data={queue}
            index={index}
            set={(queue) => {
              store.dispatch({
                type: 'SET_QUEUE',
                queue
              })
            }}
            onSwitch={(i) => {
              store.dispatch({
                type: 'SELECT_QUEUE',
                index: i
              })
            }}
          />
          <div style={[styles.preview]}>
            {
              queue[index] &&
              <Loader
                params={queue[index]}
                table={table}
                index={index}
                push={(table) => {}}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  main: {
    position: 'absolute',
    width: '100%',
    minWidth: 640,
    minHeight: '100%',
    left: 0,
    top: 0,
    backgroundColor: '#ffe',
    fontFamily: 'Helvetica',
    fontSize: '1.5em',
    color: '#333',
    boxSizing: 'border-box'
  },
  row: {
    width: '100%'
  },
  col: {
    width: '50%',
    float: 'left'
  }
}

export default Container