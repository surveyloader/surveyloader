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
        viewBox={'0 0 100 ' + Number(height + 10)}
        style={[styles.svg, modStyle]}
      >
        <rect
          x={0}
          y={7}
          width={100}
          height={height}
          fill="#eee"
        >
        </rect>
        <rect
          x={0}
          y={7}
          width={percent}
          height={height}
          fill={color}
        >
        </rect>
        {
          delta > 0 &&
          <g>
            <rect
              x={percent}
              y={7}
              width={delta}
              height={height}
              fill={Color(color).darken(0.7).rgbString()}
            ></rect>
            <path
              fill={'#000'}
              d={`
                M ${percent},2
                l ${delta - 2},0
                l 0,2
                l ${2 - delta},0
                Z
              `}
            ></path>
            <path
              fill={'#000'}
              d={`
                M ${percent + delta - 2},0
                l 2,3
                l -2,3
                Z
              `}
            ></path>
          </g>
        }
        {
          delta < 0 &&
          <g>
            <path
              fill={'#000'}
              d={`
                M ${percent},2
                l ${delta + 2},0
                l 0,2
                l ${-2 - delta},0
                Z
              `}
            ></path>
            <path
              fill={'#000'}
              d={`
                M ${percent + delta + 2},0
                l -2,3
                l 2,3
                Z
              `}
            ></path>
          </g>
        }
        <rect
          x={percent + delta - 0.5}
          y={7}
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