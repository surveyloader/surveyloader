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
      '$text_$(aspect_a_0)',
      '$text_$(aspect_a_1)',
      '$text_$(aspect_a_2)'
    ],
    aspect_ratings: [
      '$rating_$(aspect_a_0)',
      '$rating_$(aspect_a_1)',
      '$rating_$(aspect_a_2)'
    ],
    aspect_colors: [
      '$color_$(aspect_a_0)',
      '$color_$(aspect_a_1)',
      '$color_$(aspect_a_2)'
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
    const { floor, log2, abs } = Math
    let degree = this.props.texts_deg_pref[floor(log2(abs(delta)))] || ''
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

    const [i=0,j=0] = aspect_pairs[0]

    return (
      <div style={[styles.main]}>
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
                ...styles.container, 
                opacity: animating ? 0 : `${interpolated.val}`,
                marginLeft: animating ? 0 : (1 - interpolated.val) * -200,
                marginRight: animating ? 0 : (1 - interpolated.val) * 200
              }}>
              <div style={[styles.half]}>
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspect_texts[i]}
                  rating={aspect_ratings[i]}
                  color={aspect_colors[i]}
                  delta={tradeoff[0]}
                  deltaText={::this.deltaText(tradeoff[0])}
                />
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspect_texts[j]}
                  rating={aspect_ratings[j]}
                  color={aspect_colors[j]}
                  delta={0}
                />
                <Button
                  modStyle={{marginTop: 15}}
                  text={text_prefer_option}
                  handler={() => ::this.choose(-1)} 
                />
              </div>
              <div style={[styles.half]}>
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspect_texts[i]}
                  rating={aspect_ratings[i]}
                  color={aspect_colors[i]}
                  delta={0}
                />
                <Aspect
                  modStyle={{flex: 1}}
                  text={aspect_texts[j]}
                  rating={aspect_ratings[j]}
                  color={aspect_colors[j]}
                  delta={tradeoff[1]}
                  deltaText={::this.deltaText(tradeoff[1])}
                />
                <Button
                  modStyle={{marginTop: 15}}
                  text={text_prefer_option}
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