import React, { PropTypes } from 'react'
import _ from 'lodash'
import Radium from 'radium'

import smiley from '../images/smiley.svg'
import frowny from '../images/frowny.svg'

@Radium
class Handle extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    position: PropTypes.number
  }

  render () {
    let { width, height, position } = this.props
    return (
      <path
        style={[styles.handle]}
        strokeWidth="0.25"
        stroke="#000"
        strokeOpacity="0.5"
        fill="#fff"
        fillOpacity="0.9"
        d={
          `M ${position- (width/2)},0 
          l ${width},0 l 0,${height/2} 
          l -${width/2},${height/2} 
          l -${width/2},-${height/2} 
          Z`
        }
      ></path>
    )
  }
}

@Radium
class Slider extends React.Component {
  static defaultProps = {
    position: 0,
    height: '4rem',
    color: '#f44',
    min: -100,
    max: 100
  }

  constructor (props) {
    super(props)
    this.state = {
      position: props.position,
      movable: false
    }
    this.mouseUp = this.handleMouseUp.bind(this)
    this.mouseMove = this.handleMouseMove.bind(this)
    this.move.bind(this)
    window.addEventListener('mouseup', this.mouseUp)
    window.addEventListener('mousemove', this.mouseMove)
  }

  move (position) {
    const { handleChange, min, max } = this.props
    handleChange(Math.max(min, Math.min(max, Math.floor(position))))
  }

  handleMouseDown (event) {
    const { min, max } = this.props
    this.setState({ movable: true })
    let { clientX } = event
    let { left, width } = this._bar.getBoundingClientRect()
    this.move(((max - min) * (clientX - left) / width) + min)
  }

  handleMouseUp (event) {
    this.setState({ movable: false })
  }

  handleMouseMove (event) {
    const { min, max } = this.props
    let { clientX } = event
    let { left, width } = this._bar.getBoundingClientRect()
    if (this.state.movable) this.move(((max - min) * (clientX - left) / width) + min)
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.mouseUp)
    window.removeEventListener('mousemove', this.mouseMove)
  }

  render () {
    const {
      position,
      delta,
      height,
      color,
      modStyle,
      min,
      max
    } = this.props

    const range = max - min

    return (
      <svg
        viewBox={`0 0 ${range + 10} 28`}
        style={[styles.svg, modStyle]}
        onMouseDown={this.handleMouseDown.bind(this)}
      >
        <defs>
          <linearGradient id="gradient">
            <stop offset={'0%'} stopColor={'#eee'} />
            <stop offset={'50%'} stopColor={'#eee'} />
            <stop offset={'100%'} stopColor={'#eee'} />
          </linearGradient>
        </defs>
        <g transform="translate(5,10)">
          <rect 
            y={0}
            width={range}
            height={8}
            fill="url(#gradient)"
            stroke="#fff"
            strokeWidth="0.25"
            ref={(c) => this._bar = c}
          >
          </rect>
          <rect 
            y={0}
            width={Math.abs(min - position)}
            height={8}
            fill={color}
            stroke="#fff"
            strokeWidth="0.25"
          >
          </rect>
          {
            _.range(min, max + 1)
              .filter((n) => n % 10 === 0)
              .map((n) => (
                <g key={n}>
                  <rect
                    x={Math.abs(min - n)}
                    y={9}
                    width={0.2}
                    height={1}
                    style={[styles.tick]}
                  ></rect>
                  <text
                    x={Math.abs(min - n)}
                    y={14}
                    style={[styles.text]}
                  >{Number(n)}</text>
                </g>
              ))
          }
        </g>
        <rect
          x={5}
          y={0}
          width={0.25}
          height={20}
          style={[styles.tick]}
        ></rect>
        <rect
          x={range + 5}
          y={0}
          width={0.25}
          height={20}
          style={[styles.tick]}
        ></rect>
        <text
          x={6}
          y={5}
          style={[styles.labelLeft]}
        >worst possible</text>
        <text
          x={range + 4.25}
          y={5}
          style={[styles.labelRight]}
        >best possible</text>
        <g transform="translate(5,10)">
          <Handle width={8} height={8} position={Math.abs(min - position)} />
        </g>
      </svg>
    )
  }
}

const styles = {
  svg: {
    width: '100%',
    height: 'auto',
    cursor: 'pointer'
  },
  handle: {
    cursor: 'pointer'
  },
  tick: {
    fill: '#000' 
  },
  text: {
    fontSize: '.25rem',
    textAnchor: 'middle',
    userSelect: 'none'
  },
  labelLeft: {
    fontSize: '.3rem',
    fontWeight: 'bold',
    textAnchor: 'start',
    userSelect: 'none'
  },
  labelRight: {
    fontSize: '.3rem',
    fontWeight: 'bold',
    textAnchor: 'end',
    userSelect: 'none'
  }
}

export default Slider