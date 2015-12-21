import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { Motion, spring, presets } from 'react-motion'
import { declare, type } from '../../global/types'
import colorScheme from '../../global/services/colorScheme'
import identify from '../../global/services/stringHash'
import Scenario from '../../global/components/Scenario'

@Radium
class App extends React.Component {
  static propTypes = {
    aspects: declare(
      type.Array(
        type.Object({
          text: type.string,
          rating: type.number,
          color: type.string
        })
      )
    ),
    aspect_pairs: declare(type.array),
    tradeoff_range: declare(type.Array(type.number)),
    tradeoff_sign: declare(type.number),
    texts_deg_pref: declare(type.array),
    text_increases: declare(type.string),
    text_decreases: declare(type.string),
    text_option_one: declare(type.string),
    text_option_two: declare(type.string),
    text_prefer_option: declare(type.string),
    text_instruct_title: declare(type.string),
    text_instruct_body: declare(type.string)
  }

  static defaultProps = {
    aspects: [
      {
        text: 'one',
        rating: 51,
        color: '#f77'
      },{
        text: 'two',
        rating: 52,
        color: '#7f7'
      },{
        text: 'three',
        rating: 53,
        color: '#77f'
      }
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
    text_option_one: 'Option 1',
    text_option_two: 'Option 2',
    text_prefer_option: 'I prefer this option',
    text_instruct_title: 'Instructions',
    text_instruct_body: 'Imagine you are facing a personal/policy choice. Each option either increases or decreases the level of one of the aspects of your life/the lives of all people in your nation. You should assume that all other aspects of your life/people’s lives that are not shown in these options will not change and will be the same as last year. Between these two options, which do you think you would choose?'
  }

  static simulate (props) {
    const {
      aspects,
      aspect_pairs,
      tradeoff_range
    } = props

    return _(aspect_pairs)
      .map(([i,j]) => [
        `triple_${identify(aspects[i].text)}_${identify(aspects[j].text)}`,
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
      tradeoff_sign ?
        tradeoff_range.map(t => -t) :
        tradeoff_range

    let increases_decreases =
      tradeoff_sign ?
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
      aspects,
      push
    } = this.props

    if (!state.aspect_pairs.length > 0) {
      push(
        _(this.props.aspect_pairs)
          .map(([i,j]) => [
            `triple_${identify(aspects[i].text)}_${identify(aspects[j].text)}`,
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
    const {
      text_increases,
      text_decreases
    } = this.props
    return delta < 0 ?
      text_decreases : text_increases
  }

  render () {
    const {
      text_instruct_title,
      text_instruct_body,
      text_prefer_option,
      text_option_one,
      text_option_two,
      aspects
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
                  heading={text_option_one}
                  aspects={[
                    {
                      text: aspects[i].text,
                      rating: aspects[i].rating,
                      color: aspects[i].color,
                      change: tradeoff[0],
                      deltaText: this.deltaText.bind(this)(tradeoff[0])
                    }, {
                      text: aspects[j].text,
                      rating: aspects[j].rating,
                      color: aspects[j].color,
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
                  heading={text_option_two}
                  aspects={[
                    {
                      text: aspects[i].text,
                      rating: aspects[i].rating,
                      color: aspects[i].color,
                      change: 0,
                      deltaText: null
                    }, {
                      text: aspects[j].text,
                      rating: aspects[j].rating,
                      color: aspects[j].color,
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