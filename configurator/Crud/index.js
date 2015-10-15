import React from 'react'
import Radium from 'radium'
import styles from './styles'
import http from 'superagent'

import Auth from '../../global/services/auth'

@Radium
export default class Crud extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.loadSurveys(this.props.store)

    Auth.on(info => {
      console.log(info)
      if (info) {
        this.props.store.dispatch({
          type: 'AUTHORIZE',
          info
        })
      } else {
        this.props.store.dispatch({
          type: 'AUTHORIZE',
          info: null
        })
      }
    })
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

  saveSurvey () {
    const { auth, info, initTable, queue, surveyName } = this.props
    console.log(initTable)
    const authors = String(info.author).split(',')
    const author = 
      authors.indexOf(`${auth.github.username}@github`) > 0 ?
      authors.join(',') :
      authors
        .filter(a => a)
        .concat(`${auth.github.username}@github`)
        .join(',')

    Auth
      .saveConfiguration(
        surveyName,
        {
          info: {
            ...info,
            author,
            modified: {
              '.sv': 'timestamp'
            }
          },
          table: initTable,
          queue: queue.length ? queue : null
        },
        () => this.loadSurveys(this.props.store)
      )
  }

  render () {
    const {
      info,
      auth,
      initTable,
      queue,
      store,
      surveys,
      surveyName,
      surveyVersion
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
                      {new Date(surveys[surveyName][v].info.modified).toString()}
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
        </div>
        <div style={[styles.row, { flex: 0.125 }]}>
          <span>name:</span>
          <input
            type="text"
            key={surveyName}
            defaultValue={surveyName}
          />&nbsp;
          <span>author:{info.author}</span>
          &nbsp;
          {
            auth &&
            <div>
              <em style={{color:'#ddd'}}>
                {`(${auth.github.username}@github)`}
              </em>
              &nbsp;
              <input
                type="button"
                value="Save"
                onClick={::this.saveSurvey}
              />
            </div>
          }
        </div>
      </div>
    )
  }
}