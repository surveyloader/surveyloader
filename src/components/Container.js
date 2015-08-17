import React from 'react'
import Radium from 'radium'
import store from '../stores'

import Loader from './Loader'
import FlatTable from './FlatTable'

import { queue, table } from '../../static/basic.json'

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
        <div style={[styles.dev]} key="dev">
          <FlatTable
            data={table}
            set={(newTable) => {
              store.dispatch({
                type: 'SET_TABLE',
                table: newTable
              })
            }} 
          />
        </div>
        <div style={[styles.container]} key="container">
          <div style={[styles.center]}>
            <p>Index: {index}</p>
            {
              queue &&
              <Loader
                specs={queue[index]}
                table={table}
                index={index}
                push={(table) => {
                  store.dispatch({
                    type: 'PUSH',
                    index: index + 1,
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
  dev: {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
    height: 100,
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