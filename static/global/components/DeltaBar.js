import React from 'react'
import Radium from 'radium'
import Color from 'color'

@Radium
class DeltaBar extends React.Component {
  static defaultProps = {
    percent: 70,
    delta: 10,
    height: 3,
    color: '#f44'
  }

  render () {
    const {
      percent,
      delta,
      height,
      color,
      modStyle 
    } = this.props
    return (
      <svg
        width="100%"
        viewBox={'0 0 100 ' + height}
        style={[styles.svg, modStyle]}
      >
        <rect
          x={0}
          width={100}
          height={height}
          fill="#eee"
        >
        </rect>
        <rect
          x={0}
          width={percent}
          height={height}
          fill={color}
        >
        </rect>
        {
          delta > 0 &&
          <rect
            x={percent}
            width={delta}
            height={height}
            fill={Color(color).darken(0.3).rgbString()}
          >
          </rect>
        }
        {
          delta < 0 &&
          <rect
            x={percent + delta}
            width={-delta}
            height={height}
            fill={Color(color).lighten(0.2).rgbString()}
          >
          </rect>
        }
        <rect
          x={percent + delta - 0.5}
          width={0.5}
          height={height}
          fill={'#000'}
        >
        </rect>
      </svg>
    )
  }
}

const styles = {
  svg: {
    padding: 0,
    margin: 0
  }
}

export default DeltaBar