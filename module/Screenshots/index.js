import React from 'react'
import Radium from 'radium'
import http from 'superagent'
import styles from './styles'

import Lightbox from '../../global/components/Lightbox'

@Radium
export default class Screenshots extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    this.fetchShots.bind(this)(this.props.moduleType)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchShots.bind(this)(nextProps.moduleType)
  }

  fetchShots (moduleType) {
    http
      .get(`https://surveyloader.firebaseio.com/screenshots/${moduleType}.json`)
      .end((err, res) => {
        const raw = res.body
        const key0 = Object.keys(raw).reverse()[0]
        if (!err) this.setState({
          data: raw[key0]
        })
      })
  }

  render () {
    const { data, viewImage } = this.state
    return (
      <div style={[styles.col]}>
        {
          viewImage &&
          <Lightbox
            src={viewImage}
            dismiss={() => this.setState({ viewImage: null })}
          />
        }
        <div style={[styles.heading]}>
          Screenshots
        </div>
        {
          data &&
          data.screenshots.map((s, i) => {
            return (
              <div
                key={i} style={[styles.item]}
                onClick={() => this.setState({ viewImage: s.image_url })}
              >
                <img src={s.thumb_url} style={[styles.thumb]} />
                <span style={[styles.line]}>
                  <strong>OS:</strong> {s.os} {s.os_version}
                </span>
                <span style={[styles.line]}>
                  <strong>Browser:</strong> {s.browser} {s.browser_version}
                </span>
                {
                  s.device &&
                  <span style={[styles.line]}>
                    <strong>Device:</strong> {s.device}
                  </span>
                }
                <span style={[styles.line]}>
                  <strong>Created:</strong> {s.created_at}
                </span>
              </div>
            )
          })
        }
      </div>
    )
  }
}