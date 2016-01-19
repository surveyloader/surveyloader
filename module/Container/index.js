import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import http from 'superagent'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import styles from './styles'
import store from '../store'

import Preview from '../Preview'
import Parameters from '../../configurator/Parameters'
import Doc from '../../docs/Doc'
import Screenshots from '../Screenshots'

import modulesList from '../../modules/list.json'

@DragDropContext(HTML5Backend)
@Radium
class Container extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })
  }

  componentWillMount () {
    const [, fullscreen, params] = location.search
      .match(/(\?fullscreen\/|\?)(.+)/)
      || [null, null, null]
    
    if (fullscreen === '?fullscreen/') {
      store.dispatch({
        type: 'FULL_SCREEN',
        enabled: true
      })
    }

    if (params) {
      store.dispatch({
        type: 'CHANGE_MODULE_PARAMS',
        params: JSON.parse(decodeURIComponent(params))
      })
    } else {
      store.dispatch({
        type: 'CHANGE_MODULE_TYPE',
        into: modulesList[0]
      })
    }
  }

  componentWillUpdate (props, state) {
    const { params, fullscreen } = state
    const search = fullscreen ?
      `?fullscreen/${encodeURIComponent(JSON.stringify(params))}` :
      `?${encodeURIComponent(JSON.stringify({ type: params.type }))}`

    if (params.type) {
      history.pushState(null, null, search)
    }
  }

  render () {
    const {
      params,
      urlParams,
      fullscreen
    } = this.state

    const previewProps = {
      params,
      urlParams,
      table: {}
    }

    const paramProps = {
      params,
      store
    }

    const embedded = (
      <div style={[styles.main]}>
        <select
          defaultValue={params.type}
          onChange={e => {
            store.dispatch({
              type: 'CHANGE_MODULE_TYPE',
              into: e.target.value
            })
          }}
        >
        {
          modulesList.map((m, i) => {
            return (
              <option
                key={i}
                value={m}
              >{m}</option>
            )
          })
        }
        </select>
        <div style={[styles.documentation]}>
          <div style={[styles.heading, { paddingBottom: 0 }]}>
            Documentation
          </div>
          <Doc path={`modules/${params.type}`} />
        </div>
        <Preview
          {...previewProps}
          reload={() => {
            store.dispatch({
              type: 'CHANGE_MODULE_TYPE',
              into: params.type
            }) 
          }}
        />
        <div style={[styles.row]}>
          <Parameters {...paramProps} />
          <Screenshots moduleType={params.type} />
        </div>
      </div>
    )

    const full = (
      <div>
        <Preview {...previewProps} fullscreen={true} />
        <Parameters {...paramProps} hidden={true} />
      </div>
    )

    return fullscreen ?
      full :
      embedded
  }
}

export default Container