import React from 'react'
import Radium from 'radium'
import store from '../stores'

import Loader from './Loader'
import Table from './Table'
import Queue from './Queue'

import { table, queue } from '../../static/basic.json'

@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })   
  }

  componentDidMount () {
    store.dispatch({
      type: 'SET',
      queue,
      table
    })
  }

  render () {
    const { queue, table, index } = this.state
    return (
      <div style={[styles.main]}>
        <div style={[styles.row]}>
          <div style={[styles.dev]} key="table">
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
          <div style={[styles.dev]} key="queue">
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
                  type: 'SET_INDEX',
                  index: i
                })
              }}
            />
          </div>
        </div>
        <div style={[styles.container]} key="container">
          <div style={[styles.center]}>
            {
              queue &&
              <Loader
                specs={queue[index]}
                table={table}
                index={index}
                push={(table) => {
                  store.dispatch({
                    type: 'PUSH',
                    index: Number(index) + 1,
                    table
                  })
                }}
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
    display: 'flex',
    backgroundColor: '#000'
  },
  dev: {
    flex: 1,
    position: 'relative',
    boxSizing: 'border-box',
    margin: 5,
    padding: 5,
    backgroundColor: '#000',
    width: '50%',
    height: 200,
    overflowX: 'hidden',
    overflowY: 'scroll'
  },
  container: {
    position: 'relative',
    minHeight: '100%',
    width: '100%'
  },
  center: {
    position: 'relative',
    width: '100%',
    margin: '0 auto',
    '@media (min-width:1000px)': {
      width: 1000
    },
    '@media (max-width:600px)': {
      width: 600
    }
  }
}

export default Container