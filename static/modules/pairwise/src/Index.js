import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import colorScheme
from '../../../global/services/colorScheme'
import identify
from '../../../global/services/stringHash'

import Aspect from '../../../global/components/Aspect'
import Button from '../../../global/components/Button'

@Simulate
@Radium
class App extends React.Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    pairwise_like: PropTypes.string,
    pairwise_dislike: PropTypes.string,
    pairwise_tradeoffs: PropTypes.array,
    aspects: PropTypes.array
  }

  static defaultProps = {
    pairwise_like: 'I prefer this option',
    pairwise_dislike: 'I prefer this option',
    pairwise_tradeoffs: [
      [4,4],
      [1,4],[4,1],
      [1,8],[2,4],[4,1],[8,1]
    ]
  }

  static output = {
    pairwise_$aspect0$_$aspect1$_choice: Pre
      .number.of(_.range(7,15)),
    pairwise_$aspect0$_$aspect1$_order: Pre
      .number.of([1,-1]),
    pairwise_$aspect0$_$aspect1$_sign: Pre
      .number.of([1,-1])
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
    this.setState({ choice })
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
      aspects,
      table
    } = this.props
    const { choice } = this.state

    return (
      <div style={[styles.main]}>
        <div style={[styles.container]}>
          <div style={[styles.half]}>
            <Aspect
              text={aspects[0]}
              rating={table[identify(aspects[0]) + '_rating']}
              color={table[identify(aspects[0]) + '_color']}
              delta={pairwise_tradeoffs[choice][0]}
            />
            <Aspect
              text={aspects[1]}
              rating={table[identify(aspects[1]) + '_rating']}
              color={table[identify(aspects[1]) + '_color']}
              delta={0}
            />
            <Button
              modStyle={{marginTop:15}}
              text={pairwise_dislike}
              handler={() => this.choose.bind(this)(1)} 
            />
          </div>
          <div style={[styles.half]}>
            <Aspect
              text={aspects[0]}
              rating={table[identify(aspects[0]) + '_rating']}
              color={table[identify(aspects[0]) + '_color']}
              delta={0}
            />
            <Aspect
              text={aspects[1]}
              rating={table[identify(aspects[1]) + '_rating']}
              color={table[identify(aspects[1]) + '_color']}
              delta={pairwise_tradeoffs[choice][1]}
            />
            <Button
              modStyle={{marginTop:15}}
              text={pairwise_like}
              handler={() => this.choose.bind(this)(2)}
            />
          </div>
        </div>
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
    display: 'flex'
  },
  half: {
    flex: 1,
    boxSizing: 'border-box',
    margin: 5,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#fff'
  }
}

export default App