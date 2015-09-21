import React, { PropTypes } from 'react'
import Radium from 'radium'

import ColorScheme from '../../../global/services/colorScheme'
import Format from '../../../global/services/format'

import Slider from '../../../global/components/Slider'
import Button from '../../../global/components/Button'

@Radium
class RateAspect extends React.Component {
  render () {
    const { 
      aspect,
      handleRating,
      handleConfirm,
      rateText,
      confirmText
    } = this.props

    return (
      <div style={[styles.container]}>
        <div style={[styles.aspect]}>
          <div style={[styles.heading]}>
            <em style={{float:'left'}}>
              {Format.capitalize(aspect.text)}
            </em>
            {
              aspect.rating &&
              <span style={{ float:'right', fontWeight: 'bold' }}>
                {Number(aspect.rating)}
              </span>
            }
          </div>
          <Slider
            color={ColorScheme.index(aspect.index)}
            percent={aspect.rating}
            handleChange={handleRating} 
          />
        </div>
        {
          aspect.rating
          &&
          <div style={[styles.button]}>
            <Button
              text={confirmText}
              handler={() => handleConfirm(aspect)}
            />
          </div>
          || aspect.index === 0 &&
          <svg
            width="100%"
            viewBox="0 0 100 10"
          >
            <path
              stroke="#559"
              strokeWidth="0.25px"
              fill="#fff"
              d="
                M 50,0
                l -1,1
                l 1, -1
                l 1, 1
                l -1, -1
                c 0,10 15,-5 19,5
              "
            >
            </path>
            <text
              x="70"
              y="10"
              dy="-2px"
              fontSize="3px"
              fill="#559"
              textAnchor="middle"
            >
              {rateText}
            </text>
          </svg>
        }
      </div>
    )
  }
}

const styles = {
  container: {
    padding: 30,
    boxSizing: 'border-box',
    borderRadius: 15,
    boxShadow: '2px 2px 4px #ddd',
    backgroundColor: '#fff',
    userSelect: 'none',
    overflow: 'auto',
    zoom: 1
  },
  heading: {
    marginBottom: 15,
    overflow: 'auto',
    zoom: 1
  },
  button: {
    marginTop: 30,
    float: 'right'
  }
}

export default RateAspect