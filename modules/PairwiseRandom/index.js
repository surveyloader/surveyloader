import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { Motion, spring, presets } from 'react-motion'

import colorScheme
from '../../global/services/colorScheme'
import identify
from '../../global/services/stringHash'

import Aspect from '../../global/components/Aspect'
import Button from '../../global/components/Button'

@Radium
class App extends React.Component {
  static propTypes = {
    like: PropTypes.string,
    dislike: PropTypes.string,
    tradeoff_range: PropTypes.array,
    tradeoff_sign: PropTypes.number,
    log_degree: PropTypes.array,
    n: PropTypes.number,
    aspects: PropTypes.array
  }

  static defaultProps = {
    instructions: 'Instructions',
    text: 'Each option either increases or decreases the level of one of the aspects you rated. Please choose which option you would prefer.',
    like: 'I prefer this option',
    dislike: 'I prefer this option',
    tradeoff_range: _.range(1,9),
    tradeoff_sign: '$coin',
    log_degree: [
      'slightly',
      'moderately',
      'strongly',
      'greatly'
    ],
    n: 3,
    aspects: ['one', 'two']
  }

  static simulate (props) {
    const { aspects } = props
    return {
      [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_lower`]: 0.5,
      [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_upper`]: 2
    }
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    let tradeoff_range =
      this.props.tradeoff_sign < 0 ?
      this.props.tradeoff_range.map(t => -t) :
      this.props.tradeoff_range

    let increases_decreases =
      this.props.tradeoff_sign < 0 ?
      'decreases' :
      'increases'

    this.setState({ 
      tradeoff: [
        _.sample(tradeoff_range),
        _.sample(tradeoff_range)
      ],
      upper: Infinity,
      lower: 0,
      choices: 0,
      tradeoff_range,
      increases_decreases
    })
  }

  pushIfDone () {
    const { aspects, n, push } = this.props
    const { lower, upper, choices } = this.state
    if (choices + 1 > n) {
      push({
        [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_lower`]: lower,
        [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_upper`]: upper
      })
    }
  }

  choose (option) {
    const { tradeoff_range, tradeoff, lower, upper, choices } = this.state
    const pushIfDone = () => this.pushIfDone.bind(this)()
    console.log('choices' + choices)
    let mrs = tradeoff[1] / tradeoff[0]
    if (option === 1 && mrs < upper) {
      this.setState({ upper: mrs, choices: choices + 1 }, pushIfDone)
    } else if (option === 2 && mrs > lower) {
      this.setState({ lower: mrs, choices: choices + 1 }, pushIfDone)
    } else {
      this.setState({ choices: choices + 1 }, pushIfDone)
    }

    this.setState({
      animating: true,
      tradeoff: [
        _.sample(tradeoff_range),
        _.sample(tradeoff_range)
      ]
    })
    setTimeout(() => this.setState({ animating: false }), 300)
  }

  deltaText (delta) {
    const { floor, log2, abs } = Math
    let degree = this.props.log_degree[floor(log2(abs(delta)))] || ''
    return `${degree} ${this.state.increases_decreases}`
  }

  render () {
    const {
      aspects,
      like,
      dislike,
      instructions,
      text,
      log_degree,
      increases_decreases,
      aspects,
      table
    } = this.props

    const { animating, tradeoff } = this.state

    return (
      <div style={[styles.main]}>
        <div style={[styles.instructions]}>
          <b>{instructions}</b>
          <div>{text}</div>
        </div>
        <Motion
          defaultStyle={{val: 0}}
          style={{val: spring(1, presets.nowobble)}}
        >
        {
          (interpolated) => (
            <div 
              style={{
                ...styles.container, 
                opacity: animating ? 0 : `${interpolated.val}`,
                marginLeft: animating ? 0 : (1 - interpolated.val) * -200,
                marginRight: animating ? 0 : (1 - interpolated.val) * 200
              }}>
              <div style={[styles.half]}>
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspects[0]}
                  rating={table[identify(aspects[0]) + '_rating']}
                  color={table[identify(aspects[0]) + '_color']}
                  delta={tradeoff[0]}
                  deltaText={::this.deltaText(tradeoff[0])}
                />
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspects[1]}
                  rating={table[identify(aspects[1]) + '_rating']}
                  color={table[identify(aspects[1]) + '_color']}
                  delta={0}
                />
                <Button
                  modStyle={{marginTop: 15}}
                  text={dislike}
                  handler={() => ::this.choose(1)} 
                />
              </div>
              <div style={[styles.half]}>
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspects[0]}
                  rating={table[identify(aspects[0]) + '_rating']}
                  color={table[identify(aspects[0]) + '_color']}
                  delta={0}
                />
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspects[1]}
                  rating={table[identify(aspects[1]) + '_rating']}
                  color={table[identify(aspects[1]) + '_color']}
                  delta={tradeoff[1]}
                  deltaText={::this.deltaText(tradeoff[1])}
                />
                <Button
                  modStyle={{marginTop: 15}}
                  text={like}
                  handler={() => ::this.choose(2)}
                />
              </div>
            </div>
          )
        }
        </Motion>
      </div>
    )
  }
}

const styles = {
  main: {
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    borderRadius: 15,
    boxSizing: 'border-box'
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  half: {
    flex: 1,
    boxSizing: 'border-box',
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    borderRadius: 15,
    boxShadow: '2px 2px 4px #ddd',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  instructions: {
    boxSizing: 'border-box',
    width: '100%',
    paddingTop: 30,
    paddingRight: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    marginTop: 30,
    marginRight: 0,
    marginBottom: 30,
    marginLeft: 0,
    borderRadius: 15,
    boxShadow: '2px 2px 4px #ddd',
    background: '#fff'
  }
}

export default App