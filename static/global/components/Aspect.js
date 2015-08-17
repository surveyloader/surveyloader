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
      <div style={[styles.main]}>
        <div style={[styles.blurb]}>
          {
            delta > 0 &&
            <span style={[styles.delta, {background: '#2f2'}]}>
              {' +' + delta}
            </span>
          }
          {
            delta < 0 &&
            <span style={[styles.delta]}>
              {' -' + String(-delta)}
            </span>
          }
          <span style={[styles.rating]}>
            {rating}
          </span>
          <p style={[styles.text]}>
            {Format.capitalize(text)}
          </p>
          { deltaText && <em>{deltaText}</em>}
        </div>
        <DeltaBar
          percent={rating}
          color={color} 
          delta={delta}
        />
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
    padding: '2px 5px'
  },
  delta: {
    float: 'right',
    color: '#fff',
    fontWeight: 100,
    padding: '2px 5px',
    background: '#f22',
    borderRadius: 30
  }
}

export default Aspect