import React from 'react'
import Radium from 'radium'
import DeltaBar from './DeltaBar'
import Format from '../services/format'

@Radium
class Aspect extends React.Component {
  static defaultProps = {
    text: 'Aspect text',
    rating: 20,
    delta: 4,
    deltaText: '',
    color: '#f77'
  }

  render () {
    const {
      text,
      rating,
      delta,
      deltaText,
      color,
      modStyle
    } = this.props
    return (
      <div style={[styles.main, modStyle]}>
        <DeltaBar
          percent={rating}
          color={color} 
          delta={delta}
        />
        <div style={[styles.blurb]}>
          <span style={[styles.rating]}>
            {rating + delta}
          </span>
          <p style={[styles.text]}>
            {Format.capitalize(text)}
            {
              deltaText &&
              <span>
                <b>{' ' + deltaText + ' '}</b>
                <span style={[styles.delta]}>
                  {'+' + String(delta)}
                </span>
              </span>
            }
          </p>
        </div>
      </div>
    )
  }
}

const styles = {
  main: {
    boxSizing: 'border-box',
    padding: '15px 0'
  },
  blurb: {
    marginBottom: 15
  },
  text: {
    fontSize: '1em',
    margin: 0,
    fontStyle: 'italic'
  },
  rating: {
    float: 'right',
    padding: '2px 5px 15px 15px',
    fontWeight: 'bold'
  },
  delta: {
    color: '#fff',
    fontWeight: 100,
    padding: '3px 5px',
    background: '#000',
    borderRadius: 30
  }
}

export default Aspect