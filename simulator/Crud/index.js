import React from 'react'
import Radium from 'radium'
import styles from './styles'
import http from 'superagent'
import _ from 'lodash'

import simulateOver from '../../global/services/simulateOver'

@Radium
export default class Crud extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.loadSurveys(this.props.store)
  }

  loadSurveys (store) {
    http
      .get('https://surveyloader.firebaseio.com/configurations.json')
      .end((err, res) => {
        store.dispatch({
          type: 'SET_SURVEY_LIST',
          surveys: res.body
        })
      })
  }

  simulate (n, survey) {
    const { table, queue } = survey

    console.log('begin sim')
    let responses = _.range(0, n)
        .map(() => simulateOver(table, queue))
    let keys = responses
      .reduce((a, b) => _.uniq(a.concat(Object.keys(b)) ), [])
      .sort()
    let data = responses
      .map(r => keys.map(k => r[k]))

    console.log('end sim', data)

    this.props.store.dispatch({
      type: 'SET_RESPONSES',
      keys,
      data
    })
  }

  render () {
    const {
      info,
      initTable,
      queue,
      store,
      surveys,
      surveyName,
      surveyVersion,
      keys,
      data,
      showTable
    } = this.props

    const headers = keys && keys
      .map(key => `"${key}"`)
      .join(',') + '\n'

    const rows = data && data
      .map(r => r
        .map(datum => {
          return typeof datum === 'string' ||
            typeof datum === 'boolean' ?
            `"${datum}"` : datum
        })
        .join(',') + '\n'
      )
      .join('')

    return (
      <div>
        <div style={[
          styles.row, 
          { 
            flex: 0.125,
            justifyContent: 'space-between'
          }
        ]}>
          <div>
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
                      {new Date(surveys[surveyName][v].table.surveyVersion).toString()}
                    </option>
                  )
                })
            }
            </select>&nbsp;
            <input
              type="button"
              value="Load"
              onClick={() => ::this.simulate(100, surveys[surveyName][surveyVersion])}
            />
            {
              keys &&
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(headers + rows)}`}
                download={`${surveyName}${surveyVersion}.csv`}
              >Download CSV</a>
            }
          </div>
        </div>
        <div style={[styles.row]}>
          {
            keys &&
            <span>{data.length} x {keys.length}</span>
          }
          <input
            type="button"
            value={showTable ? 'Hide table' : 'Show table'}
            onClick={() => this.setState({ showTable: !showTable })}
          />
        </div>
        {
          showTable &&
          <table>
            <thead>
              <tr>
              {
                keys &&
                keys
                  .map((k, i) => <th key={i}>{k}</th>)
              }
              </tr>
            </thead>
            <tbody>
            {
              data &&
              data.map((r, i) => (
                <tr key={i}>
                {
                  _.map(r, (v, i) => <td key={i}>{v}</td>)
                }
                </tr>
              ))
            }
            </tbody>
          </table>
        }
      </div>
    )
  }
}