import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import colorScheme
from '../../../global/services/colorScheme'

import Aspect from '../../../global/components/Aspect'
import Button from '../../../global/components/Button'

@Simulate
@Radium
class App extends React.Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    pairwise_instructions: PropTypes.string.isRequired,
    pairwise_like: Pre.string.of(['dislike','like']),
    pairwise_dislike: Pre.string.of(['dislike','like']),
    pairwise_tradeoffs: PropTypes.array,
    $aspect0$_text: PropTypes.string.isRequired,
    $aspect0$_index: PropTypes.number.isRequired,
    $aspect0$_rating: Pre.number.of(_.range(0,101)),
    $aspect1$_text: PropTypes.string.isRequired,
    $aspect1$_index: PropTypes.number.isRequired,
    $aspect1$_rating: Pre.number.of(_.range(0,101))
  }

  static outputTypes = {
    pairwise_$aspect0$_$aspect1$_choice: Pre
      .number.of(_.range(7,15)),
    pairwise_$aspect0$_$aspect1$_order: Pre
      .number.of([1,-1]),
    pairwise_$aspect0$_$aspect1$_sign: Pre
      .number.of([1,-1])
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

  constructor (props) {
    super(props)
    this.state = { choice: 0 }
  }

  choose (option) {
    const {
      push,
      pairwise_tradeoffs,
      specs
    } = this.props
    const {
      $aspect0$,
      $aspect1$
    } = specs
    let choice = this.state.choice * 2 + option
    this.setState({ choice })
    if (choice + 1 > pairwise_tradeoffs.length) {
      push({
        [`pairwise_${$aspect0$}_${$aspect1$}`]: choice
      })
    }
  }

  render () {
    const {
      submit,
      pairwise_instructions,
      pairwise_tradeoffs,
      pairwise_like,
      pairwise_dislike,
      $aspect0$_text,
      $aspect0$_index,
      $aspect0$_rating,
      $aspect1$_text,
      $aspect1$_index,
      $aspect1$_rating
    } = this.props

    const { choice } = this.state

    return (
      <div style={[styles.main]}>
        <div style={[styles.container]}>
          <div style={[styles.half]}>
            <Aspect
              text={$aspect0$_text}
              rating={$aspect0$_rating}
              color={colorScheme.index($aspect0$_index)}
              delta={pairwise_tradeoffs[choice][0]}
            />
            <Aspect
              text={$aspect1$_text}
              rating={$aspect1$_rating}
              color={colorScheme.index($aspect1$_index)}
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
              text={$aspect0$_text}
              rating={$aspect0$_rating}
              color={colorScheme.index($aspect0$_index)}
              delta={0}
            />
            <Aspect
              text={$aspect1$_text}
              rating={$aspect1$_rating}
              color={colorScheme.index($aspect1$_index)}
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