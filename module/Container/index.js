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
    const params = _(location.search.slice(1).split('&'))
      .map((item) => item.split('='))
      .object()
      .value()

    if (params.full_preview) {
      store.dispatch({
        type: 'FULL_SCREEN',
        enabled: true
      })
    }

    if (params.type) {
      store.dispatch({
        type: 'CHANGE_MODULE_TYPE',
        into: params.type
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
      `?type=${params.type}&full_preview=1` :
      `?type=${params.type}`

    if (params.type) {
      history.pushState(null, null, search)
    }
  }

  render () {
    const {
      params,
      fullscreen
    } = this.state

    const previewProps = {
      params,
      table: []
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
        <Preview {...previewProps} />
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