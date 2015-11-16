import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { Motion, spring } from 'react-motion'

import colorScheme
from '../../global/services/colorScheme'
import identify
from '../../global/services/stringHash'

import Aspect from '../../global/components/Aspect'
import Button from '../../global/components/Button'

@Radium
class App extends React.Component {
  static propTypes = {
    pairwise_like: PropTypes.string,
    pairwise_dislike: PropTypes.string,
    pairwise_tradeoffs: PropTypes.array,
    aspects: PropTypes.array
  }

  static defaultProps = {
    instructions: 'Instructions',
    text: 'Each option either increases or decreases the level of one of the aspects you rated. Please choose which option you would prefer.',
    pairwise_like: 'I prefer this option',
    pairwise_dislike: 'I prefer this option',
    pairwise_tradeoffs: [
      [4,4],
      [1,4],[4,1],
      [1,8],[2,4],[4,1],[8,1]
    ],
    textual: {
      1: 'slightly improves',
      2: 'improves',
      4: 'strongly improves',
      8: 'greatly improves'
    }, 
    aspects: ['one', 'two']
  }

  static simulate (props) {
    return {
      [`pairwise_${identify(props.aspects[0])}_${identify(props.aspects[1])}`]: _.sample(_.range(7,15))
    }
  }

  constructor (props) {
    super(props)
    this.state = { choice: 0 }
  }

  choose (option) {
    const {
      push,
      pairwise_tradeoffs,
      aspects
    } = this.props
    let choice = this.state.choice * 2 + option
    this.setState({ choice, animating: true })
    setTimeout(() => this.setState({ animating: false }), 300)
    if (choice + 1 > pairwise_tradeoffs.length) {
      push({
        [`pairwise_${identify(aspects[0])}_${identify(aspects[1])}`]: choice
      })
    }
  }

  render () {
    const {
      pairwise_tradeoffs,
      pairwise_like,
      pairwise_dislike,
      instructions,
      text,
      textual,
      aspects,
      table
    } = this.props
    const { choice, animating } = this.state

    return (
      <div style={[styles.main]}>
        <div style={[styles.instructions]}>
          <b>{instructions}</b>
          <div>{text}</div>
        </div>
        <Motion
          defaultStyle={{val: 0}}
          style={{val: spring(1)}}
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
                  delta={pairwise_tradeoffs[choice][0]}
                  deltaText={textual[pairwise_tradeoffs[choice][0]]}
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
                  text={pairwise_dislike}
                  handler={() => this.choose.bind(this)(1)} 
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
                  delta={pairwise_tradeoffs[choice][1]}
                  deltaText={textual[pairwise_tradeoffs[choice][1]]}
                />
                <Button
                  modStyle={{marginTop: 15}}
                  text={pairwise_like}
                  handler={() => this.choose.bind(this)(2)}
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