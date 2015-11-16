import React, { PropTypes } from 'react'
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
    percent: 50,
    height: '3rem',
    color: '#f44'
  }

  constructor (props) {
    super(props)
    this.state = {
      percent: props.percent,
      movable: false
    }
    this.mouseUp = this.handleMouseUp.bind(this)
    this.mouseMove = this.handleMouseMove.bind(this)
    this.move.bind(this)
    window.addEventListener('mouseup', this.mouseUp)
    window.addEventListener('mousemove', this.mouseMove)
  }

  move (percent) {
    this.props.handleChange(Math.max(0, Math.min(100, Math.floor(percent))))
  }

  handleMouseDown (event) {
    this.setState({ movable: true })
    let { clientX } = event
    let { left, width } = this._bar.getBoundingClientRect()
    this.move(100 * (clientX - left) / width)
  }

  handleMouseUp (event) {
    this.setState({ movable: false })
  }

  handleMouseMove (event) {
    let { clientX } = event
    let { left, width } = this._bar.getBoundingClientRect()
    if (this.state.movable) this.move(100 * (clientX - left) / width)
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.mouseUp)
    window.removeEventListener('mousemove', this.mouseMove)
  }

  render () {
    const { percent, delta, height, color, modStyle } = this.props
    return (
      <svg
        viewBox={'0 0 110 10'}
        style={[styles.svg, modStyle]}
        onMouseDown={this.handleMouseDown.bind(this)}
      >
        <g 
          style={{ opacity: (100 - percent) / 100 }}
          dangerouslySetInnerHTML={{ 
            __html: '<image x="0" y="0" width="5" height="5" xlink:href="' + frowny + '"></image>' 
        }}>
        </g>
        <g
          style={{ opacity: percent / 100 }}
          dangerouslySetInnerHTML={{ 
            __html: '<image x="105" y="0" width="5" height="5" xlink:href="' + smiley + '"></image>'
        }}>
        </g>
        <g transform="translate(5,0)">
          <rect 
            y={0}
            width={100}
            height={5}
            fill="#eee"
            stroke="#fff"
            strokeWidth="0.25"
            ref={(c) => this._bar = c}
          >
          </rect>
          <rect 
            y={0}
            width={percent}
            height={5}
            fill={color}
            stroke="#fff"
            strokeWidth="0.25"
          >
          </rect>
          {
            [0,10,20,30,40,50,60,70,80,90,100]
              .map((num) => <text
                key={num}
                x={Number(num)}
                y={8}
                style={[styles.text]}
              >{Number(num)}</text>)
          }
          <Handle width={5} height={5} position={percent} />
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
  text: {
    fontSize: '.15rem',
    textAnchor: 'middle',
    userSelect: 'none'
  }
}

export default Slider