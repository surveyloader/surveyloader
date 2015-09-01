import React, { PropTypes } from 'react'
import Radium from 'radium'

import ColorScheme from '../../../global/services/colorScheme'
import Format from '../../../global/services/format'

import Button from '../../../global/components/Button'

@Radium
class RatedAspects extends React.Component {
  constructor () {
    super()
  }

  render () {
    const { aspects, editRating, editText } = this.props
    return (
      <div style={[styles.container]}>
        {
          aspects.map((a, i) => (
            <div
              key={a.text}
              style={[styles.aspect]}
              onClick={() => editRating(a.index)}
            >
              <div style={[styles.info]}>
                <div style={[styles.heading]}>
                  {Format.capitalize(a.text)}
                </div>
                <div style={[styles.rating]}>
                  {Number(a.rating)}
                </div>
                <svg width="100%" viewBox="0 0 100 1">
                  <rect
                    width={100}
                    height={3}
                    fill="#eee"
                  >
                  </rect>
                  <rect
                    width={a.rating}
                    height={3}
                    fill={ColorScheme.index(a.index)}
                  >
                  </rect>
                </svg>
              </div>
              <div style={[styles.button]}>
                <Button
                  text={editText}
                  modStyle={{ fontSize: '0.75em' }}
                />
              </div>
            </div> 
          ))
        }
      </div>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: 30,
    boxSizing: 'border-box',
    borderRadius: 10,
    width: '100%',
    marginTop: 30,
    overflow: 'auto',
    zoom: 1
  },
  aspect: {
    marginTop: 15,
    cursor: 'pointer',
    opacity: 0.6,
    display: 'flex',
    ':hover': {
      opacity: 1
    }
  },
  info: {
    flex: 8
  },
  heading: {
    float: 'left'
  },
  rating: {
    float: 'right'
  },
  button: { 
    display: 'inline-block',
    flex: 1,
    marginLeft: 30 
  }
}

export default RatedAspects