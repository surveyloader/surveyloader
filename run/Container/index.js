import React from 'react'
import _ from 'lodash'
import Radium from 'radium'
import http from 'superagent'
import store from '../store'

import load from '../../global/services/lazy'
import echo from '../../global/services/echo'

import Loader from '../Loader'
import Table from '../Table'
import Queue from '../Queue'

@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })

    let params = _(location.search.slice(1).split('&'))
      .map((item) => item.split('='))
      .object()
      .value()

    http
      .get(`https://surveyloader.firebaseio.com/configurations/${params.name}.json`)
      .end((err, res) => {
        let surveys = Object
          .keys(res.body)
          .map((k) => res.body[k])

        let { queue, table } = surveys.reverse()[0]
        store.dispatch({
          type: 'SET',
          queue,
          table
        })

        if (params.index) {
          store.dispatch({
            type: 'SIMULATE',
            simulation: params.index
          })
        }
      })
  }

  assignProps (params, table) {
    return  _(params)
      .map((v, k) => {
        return Array.isArray(v) ?
          [k, v.map(subv => echo(subv, table))] :
          [k, echo(v, table)]
      })
      .object()
      .value()
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { simulation, index, queue, table } = nextState
    if (simulation > index) {
      if (queue[index].type) {
        let component = load(queue[index].type)
        component.defaultProps = component.defaultProps ? component.defaultProps : {}
        component.defaultProps = _
          .assign(component.defaultProps, this.assignProps(queue[index], table))
        store.dispatch({
          type: 'PUSH',
          index: Number(index) + 1,
          table: component.simulate(component.defaultProps)
        })
      }
      return false
    } else if (simulation) {
      store.dispatch({
        type: 'SIMULATE',
        simulation: null,
        index: simulation
      })
      return false
    }
    return true
  }

  render () {
    const { queue, table, index } = this.state
    console.log(queue[index])
    let urlParams = _(location.search.slice(1).split('&'))
      .map((item) => item.split('='))
      .object()
      .value()

    return (
      <div style={[styles.main]}>
        <div>
        {
          urlParams.dev && !this.state.hideDevBar &&
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
                    type: 'SIMULATE',
                    simulation: i
                  })
                }}
              />
            </div>
          </div>
        }
        </div>
        <div>
        {
          urlParams.dev &&
          <div style={[styles.row]}>
            <input
              type="checkbox"
              value={1}
              onChange={() => this.setState({hideDevBar:!this.state.hideDevBar})}
            />
          </div>
        }
        </div>
        <div style={[styles.container]} key="container">
          <div style={[styles.center]}>
            {
              queue &&
              <Loader
                params={queue[index]}
                table={table}
                index={index}
                push={(table) => {
                  console.log(index)
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
    backgroundColor: '#ddf',
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
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
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor: '#000',
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
    marginTop: '2rem',
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    '@media (min-width:1000px)': {
      width: 1000
    },
    '@media (max-width:600px)': {
      width: 600
    }
  }
}

export default Container