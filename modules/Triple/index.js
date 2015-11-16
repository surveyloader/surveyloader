import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { Motion, spring, presets } from 'react-motion'

import colorScheme
from '../../global/services/colorScheme'
import identify
from '../../global/services/stringHash'

import Scenario from '../../global/components/Scenario'

@Radium
class App extends React.Component {
  static propTypes = {
    aspect_texts: PropTypes.array,
    aspect_ratings: PropTypes.array,
    aspect_colors: PropTypes.array,
    aspect_pairs: PropTypes.array,
    tradeoff_range: PropTypes.array,
    tradeoff_sign: PropTypes.number,
    texts_deg_pref: PropTypes.array,
    text_increases: PropTypes.string,
    text_decreases: PropTypes.string,
    text_prefer_option: PropTypes.string,
    text_instruct_title: PropTypes.string,
    text_instruct_body: PropTypes.string
  }

  static defaultProps = {
    aspect_texts: [
      'one',
      'two',
      'three'
    ],
    aspect_ratings: [
      51,
      52,
      53
    ],
    aspect_colors: [
      '#f77',
      '#7f7',
      '#77f'
    ],
    aspect_pairs: [
      [0,1],
      [0,2],
      [1,0],
      [1,2],
      [2,0],
      [2,1]
    ],
    tradeoff_range: _.range(1,9),
    tradeoff_sign: '$coin',
    texts_deg_pref: [
      'slightly',
      'moderately',
      'strongly',
      'greatly'
    ],
    text_increases: 'increases',
    text_decreases: 'decreases',
    text_prefer_option: 'I prefer this option',
    text_instruct_title: 'Instructions',
    text_instruct_body: 'Each option either increases or decreases the level of one of the aspects you rated. Please choose which option you would prefer.'
  }

  static simulate (props) {
    const {
      aspect_texts,
      aspect_pairs,
      tradeoff_range
    } = props

    return _(aspect_pairs)
      .map(([i,j]) => [
        `triple_${identify(aspect_texts[i])}_${identify(aspect_texts[j])}`,
        _.sample(tradeoff_range) * _.sample([1,-1])
      ])
      .object()
      .value()
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const {
      aspect_pairs,
      tradeoff_sign,
      tradeoff_range,
      text_decreases,
      text_increases
    } = this.props

    let signed_tradeoffs = 
      tradeoff_sign < 0 ?
        tradeoff_range.map(t => -t) :
        tradeoff_range

    let increases_decreases =
      tradeoff_sign < 0 ?
        text_decreases :
        text_increases

    this.setState({
      tradeoff: [
        _.sample(signed_tradeoffs),
        _.sample(signed_tradeoffs)
      ],
      prefs: {},
      aspect_pairs,
      signed_tradeoffs,
      increases_decreases
    })
  }

  choose (option) {
    const {
      signed_tradeoffs,
      tradeoff,
      aspect_pairs,
      prefs
    } = this.state

    const [i,j] = aspect_pairs[0]

    const state = {
      aspect_pairs: aspect_pairs.slice(1),
      tradeoff: [
        _.sample(signed_tradeoffs),
        _.sample(signed_tradeoffs)
      ],
      prefs: {
        ...prefs,
        [String(i) + String(j)]: tradeoff[1] / tradeoff[0] * option
      }
    }

    const {
      aspect_texts,
      push
    } = this.props

    if (!state.aspect_pairs.length) {
      push(
        _(this.props.aspect_pairs)
          .map(([i,j]) => [
            `triple_${identify(aspect_texts[i])}_${identify(aspect_texts[j])}`,
            state.prefs[String(i) + String(j)]
          ])
          .object()
          .value()
      )
    } else {
      this.setState(state)
      setTimeout(() => this.setState({ animating: false }), 300)
    }

    this.setState({
      animating: true
    })
  }

  deltaText (delta) {
    const { floor, log, LN2, abs } = Math
    const log2 = log(abs(delta)) / LN2
    const degree = this.props.texts_deg_pref[floor(log2)] || ''
    return `${degree} ${this.state.increases_decreases}`
  }

  render () {
    const {
      text_instruct_title,
      text_instruct_body,
      text_prefer_option,
      aspect_texts,
      aspect_ratings,
      aspect_colors
    } = this.props

    const {
      aspect_pairs,
      animating,
      tradeoff
    } = this.state

    const [i,j] = aspect_pairs[0]

    return (
      <div>
        <div style={[styles.instructions]}>
          <b>{text_instruct_title}</b>
          <div>{text_instruct_body}</div>
        </div>
        <Motion
          defaultStyle={{val: 0}}
          style={{val: spring(1, presets.nowobble)}}
        >
        {
          (interpolated) => (
            <div 
              style={{
                ...styles.row,
                opacity: animating ? 0 : `${interpolated.val}`,
                marginLeft: animating ? 0 : (1 - interpolated.val) * -200,
                marginRight: animating ? 0 : (1 - interpolated.val) * 200
              }}>
              <div style={[styles.padding(1, 0.5, 0, 0), { flex: 1 }]}>
                <Scenario
                  aspects={[
                    {
                      text: aspect_texts[i],
                      rating: aspect_ratings[i],
                      color: aspect_colors[i],
                      change: tradeoff[0],
                      deltaText: this.deltaText.bind(this)(tradeoff[0])
                    }, {
                      text: aspect_texts[j],
                      rating: aspect_ratings[j],
                      color: aspect_colors[j],
                      change: 0,
                      deltaText: null
                    }
                  ]}
                  preferText={text_prefer_option}
                  handler={() => ::this.choose(0)}
                />
              </div>
              <div style={[styles.padding(1, 0, 0, 0.5), { flex: 1 }]}>
                <Scenario
                  aspects={[
                    {
                      text: aspect_texts[i],
                      rating: aspect_ratings[i],
                      color: aspect_colors[i],
                      change: 0,
                      deltaText: null
                    }, {
                      text: aspect_texts[j],
                      rating: aspect_ratings[j],
                      color: aspect_colors[j],
                      change: tradeoff[1],
                      deltaText: this.deltaText.bind(this)(tradeoff[1])
                    }
                  ]}
                  preferText={text_prefer_option}
                  handler={() => ::this.choose(1)}
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

import gstyles from '../../global/styles'
const styles = {
  ...gstyles,
  instructions: {
    ...gstyles.panel,
    ...gstyles.padding(2)
  }
}

export default App