import React from 'react'
import Radium from 'radium'
import colorLib from 'color'

const Color = (c) => {
  try {
    colorLib(c)
  } catch (e) {
    console.log(e)
    return colorLib('#fff')
  }
  return colorLib(c)
}

@Radium
class DeltaBar extends React.Component {
  static defaultProps = {
    percent: 42,
    delta: 10,
    height: 1,
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
        viewBox={`0 0 100 1`}
        preserveAspectRatio="none"
        style={[
          styles.svg,
          { 
            height: `${Number(height + 1)}rem` 
          },
          modStyle
        ]}
      >
        <rect
          x={0}
          y={0.42}
          width={100}
          height={0.58}
          fill="#eee"
        >
        </rect>
        <rect
          x={0}
          y={0.42}
          width={percent}
          height={0.58}
          fill={color}
        >
        </rect>
        {
          delta > 0 &&
          <g>
            <rect
              x={percent}
              y={0.42}
              width={delta}
              height={0.58}
              fill={Color(color).darken(0.42).rgbString()}
            ></rect>
            <path
              fill={'#000'}
              d={`
                M ${percent},0.1
                l ${delta - 2},0
                l 0,0.2
                l ${2 - delta},0
                Z
              `}
            ></path>
            <path
              fill={'#000'}
              d={`
                M ${percent + delta - 2},0
                l 2,0.2
                l -2,0.2
                Z
              `}
            ></path>
          </g>
        }
        {
          delta < 0 &&
          <g>
            <rect
              x={percent + delta}
              y={0.42}
              width={-delta}
              height={0.58}
              fill={Color(color).lighten(0.1).rgbString()}
            ></rect>
            <path
              fill={'#000'}
              d={`
                M ${percent},0.1
                l ${delta + 2},0
                l 0,0.2
                l ${-2 - delta},0
                Z
              `}
            ></path>
            <path
              fill={'#000'}
              d={`
                M ${percent + delta + 2},0
                l -2,0.2
                l 2,0.2
                Z
              `}
            ></path>
          </g>
        }
        <rect
          x={percent + delta - 0.5}
          y={0.42}
          width={0.5}
          height={0.58}
          fill={'#000'}
        >
        </rect>
      </svg>
    )
  }
}

const styles = {
  svg: {
    width: '100%',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  }
}

export default DeltaBar