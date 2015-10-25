import React from 'react'
import Radium from 'radium'
import styles from './styles'
import http from 'superagent'
import _ from 'lodash'

import Auth from '../../global/services/auth'

@Radium
export default class Crud extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { store } = this.props

    Auth.on(info => {
      console.log(info)
      if (info) {
        store.dispatch({
          type: 'AUTHORIZE',
          info
        })

      http
        .get('https://surveyloader.firebaseio.com/responseData.json')
        .query({ auth: info.token })
        .end((err, res) => {
          store.dispatch({
            type: 'SET_SURVEY_LIST',
            surveys: res.body
          })
        })
      } else {
        store.dispatch({
          type: 'AUTHORIZE',
          info: null
        })
      }
    })
  }

  load (responseData) {
    this.props.store.dispatch({
      type: 'SET_RESPONSES',
      keys: _.values(responseData)
        .reduce((a, b) => _.uniq(a.concat(Object.keys(b)) ), [])
        .sort(),
      data: _.values(responseData)
    })
  }

  render () {
    const {
      initTable,
      queue,
      store,
      surveys,
      surveyName,
      surveyVersion,
      keys,
      data,
      auth
    } = this.props

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
            {
              auth ?
              <div>
                <span>{auth.github.username}@github</span>
                &nbsp;
                <span style={{color:'#ddd'}}>{auth.uid}</span>
                &nbsp;
                <button
                  onClick={Auth.logout}
                >Logout</button>
              </div> :
              <div>
                <button
                  onClick={Auth.login}
                >Login</button>
              </div>
            }
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
                      {new Date(Number(v)).toString()}
                    </option>
                  )
                })
            }
            </select>&nbsp;
            <input
              type="button"
              value="Load"
              onClick={() => ::this.load(surveys[surveyName][surveyVersion])}
            />
          </div>
        </div>
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
      </div>
    )
  }
}