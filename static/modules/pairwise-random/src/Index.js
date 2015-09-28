import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { Spring } from 'react-motion'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import colorScheme
from '../../../global/services/colorScheme'
import identify
from '../../../global/services/stringHash'

import Aspect from '../../../global/components/Aspect'
import Button from '../../../global/components/Button'

@Radium
class App extends React.Component {
  static propTypes = {
    like: PropTypes.string,
    dislike: PropTypes.string,
    tradeoff_range: PropTypes.array,
    textual: PropTypes.array,
    n: PropTypes.number,
    aspects: PropTypes.array
  }

  static defaultProps = {
    instructions: 'Instructions',
    text: 'Each option either increases or decreases the level of one of the aspects you rated. Please choose which option you would prefer.',
    like: 'I prefer this option',
    dislike: 'I prefer this option',
    tradeoff_range: _.range(1,9),
    textual: [
      'slightly improves',
      'moderately improves',
      'strongly improves',
      'greatly improves'
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
    this.state = { 
      tradeoff: [
        _.sample(props.tradeoff_range),
        _.sample(props.tradeoff_range)
      ],
      upper: Infinity,
      lower: 0,
      choices: 0
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { aspects } = this.props
    const { lower, upper, choices } = nextState
    if (choices  + 1 > this.props.n) {
      this.props.push({
        [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_lower`]: lower,
        [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}_upper`]: upper
      })
    }
  }

  choose (option) {
    const { tradeoff, lower, upper, choices } = this.state
    
    let mrs = tradeoff[1] / tradeoff[0]
    if (option === 1 && mrs < upper) {
      this.setState({ upper: mrs, choices: choices + 1 })
    } else if (option === 2 && mrs > lower) {
      this.setState({ lower: mrs, choices: choices + 1 })
    } else {
      this.setState({ choices: choices + 1 })
    }

    this.setState({
      animating: true,
      tradeoff: [
        _.sample(this.props.tradeoff_range),
        _.sample(this.props.tradeoff_range)
      ]
    })
    setTimeout(() => this.setState({ animating: false }), 300)
  }

  render () {
    const {
      aspects,
      like,
      dislike,
      instructions,
      text,
      textual,
      aspects,
      table
    } = this.props

    const { tradeoff, animating } = this.state
    return (
      <div style={[styles.main]}>
        <div style={[styles.instructions]}>
          <b>{instructions}</b>
          <div>{text}</div>
        </div>
        <Spring
          defaultValue={{val: animating ? 1 : 0}}
          endValue={{val: animating ? 0 : 1}}
        >
        {
          (interpolated) => (
            <div 
              style={[
                styles.container, 
                {
                  opacity: animating ? 0 : `${interpolated.val}`,
                  marginTop: animating ? 400 : (1 - interpolated.val) * 400
                }
              ]}>
              <div style={[styles.half]}>
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspects[0]}
                  rating={table[identify(aspects[0]) + '_rating']}
                  color={table[identify(aspects[0]) + '_color']}
                  delta={tradeoff[0]}
                  deltaText={textual[Math.floor(Math.sqrt(tradeoff[0]))]}
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
                  deltaText={textual[Math.floor(Math.sqrt(tradeoff[1]))]}
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
        </Spring>
      </div>
    )
  }
}

const styles = {
  main: {
    padding: 15,
    boxSizing: 'border-box'
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  half: {
    flex: 1,
    boxSizing: 'border-box',
    margin: 5,
    padding: 15,
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
    padding: 30,
    margin: '30px 0',
    borderRadius: 15,
    boxShadow: '2px 2px 4px #ddd',
    background: '#fff'
  }
}

export default App