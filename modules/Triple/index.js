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
    should_decrease: declare(type.boolean),
    texts_deg_pref: declare(type.array),
    text_increases: declare(type.string),
    text_decreases: declare(type.string),
    text_option_one: declare(type.string),
    text_option_two: declare(type.string),
    text_prefer_option: declare(type.string),
    text_instruct_title: declare(type.string),
    text_instruct_body: declare(type.Array(type.string)),
    text_instruct_conditions: declare(type.Array(type.boolean))
  }

  static defaultProps = {
    aspects: [
      {
        text: '$aspect_a_0',
        rating: '$rating_a_0',
        color: '$color_a_0'
      }, {
        text: '$aspect_a_1',
        rating: '$rating_a_1',
        color: '$color_a_1'
      }, {
        text: '$aspect_a_2',
        rating: '$rating_a_2',
        color: '$color_a_2'
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
    should_decrease: false,
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
    text_instruct_body: [
      'Imagine you are facing a policy choice. Each option either increases or decreases the level of one of the aspects of the lives of all people in your nation. You should assume that all other aspects of people’s lives that are not shown in these options will not change and will be the same as last year. Between these two options, which do you think you would choose?',
      'Imagine you are facing a personal choice. Each option either increases or decreases the level of one of the aspects of your life. You should assume that all other aspects of your life that are not shown in these options will not change and will be the same as last year. Between these two options, which do you think you would choose?'
    ],
    text_instruct_conditions: ['$policy_aspects', true]
  }

  static simulate (props) {
    const {
      aspects,
      aspect_pairs,
      tradeoff_range,
      index
    } = props
    let { should_decrease } = props

    const gt92 = _.some(aspects, a => a.rating > 92)
    const lt8 = _.some(aspects, a => a.rating < 8)
    if (gt92 && lt8) {
      return aspect_pairs
        .map(([i,j]) => {
          return {
            [`triple_${index}_${String.fromCharCode(65 + i)}`]: identify(aspects[i].text),
            [`triple_${index}_${String.fromCharCode(65 + j)}`]: identify(aspects[j].text),
            [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_1`]: 'skip',
            [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_2`]: 'skip',
            [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_t`]: Date.now(),
            [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}`]: 'skip'
          }
        })
        .reduce((a, b) => { return { ...a, ...b }  }, {})
    } else if (gt92) {
      should_decrease = true
    } else if (lt8) {
      should_decrease = false
    }

    const signed_tradeoffs =
      should_decrease ?
        tradeoff_range.map(t => -t) :
        tradeoff_range

    return aspect_pairs
      .map(([i,j]) => {
        return {
          [`triple_${index}_${String.fromCharCode(65 + i)}`]: identify(aspects[i].text),
          [`triple_${index}_${String.fromCharCode(65 + j)}`]: identify(aspects[j].text),
          [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_1`]: _.sample(signed_tradeoffs),
          [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_2`]: _.sample(signed_tradeoffs),
          [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_t`]: Date.now(),
          [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}`]: Math.random() > 0.5 ? 1 : 2
        }
      })
      .reduce((a, b) => { return { ...a, ...b }  }, {})
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const {
      aspects,
      aspect_pairs,
      tradeoff_range,
      text_decreases,
      text_increases,
      push
    } = this.props

    let { should_decrease } = this.props
    const gt92 = _.some(aspects, a => a.rating > 92)
    const lt8 = _.some(aspects, a => a.rating < 8)
    if (gt92 && lt8) {
      push({
        [`skip_${identify(aspects.map(a => a.text).join(''))}`]: Date.now()
      })
    } else if (gt92) {
      should_decrease = true
    } else if (lt8) {
      should_decrease = false
    }

    const signed_tradeoffs =
      should_decrease ?
        tradeoff_range.map(t => -t) :
        tradeoff_range

    const increases_decreases =
      should_decrease ?
        text_decreases :
        text_increases

    this.setState({
      tradeoff: [
        _.sample(signed_tradeoffs),
        _.sample(signed_tradeoffs)
      ],
      prefs: {},
      response: {},
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
      response
    } = this.state

    const {
      aspects,
      push,
      index
    } = this.props

    const [i, j] = aspect_pairs[0]

    const state = {
      aspect_pairs: aspect_pairs.slice(1),
      tradeoff: [
        _.sample(signed_tradeoffs),
        _.sample(signed_tradeoffs)
      ],
      response: {
        ...response,
        [`triple_${index}_${String.fromCharCode(65 + i)}`]: identify(aspects[i].text),
        [`triple_${index}_${String.fromCharCode(65 + j)}`]: identify(aspects[j].text),
        [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_1`]: tradeoff[0],
        [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_2`]: tradeoff[1],
        [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}_t`]: Date.now(),
        [`triple_${index}_${String.fromCharCode(65 + i)}_${String.fromCharCode(65 + j)}`]: option + 1
      }
    }

    if (!state.aspect_pairs.length > 0) {
      push(state.response)
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
      text_prefer_option,
      text_option_one,
      text_option_two
    } = this.props

    console.log(this.props.text_instruct_conditions)

    const text_instruct_body = this.props.text_instruct_body
      .filter((t, i) => this.props.text_instruct_conditions[i])[0]

    const aspects = this.props.aspects
      .map(a => {
        return {
          ...a,
          rating: typeof a.rating === 'string' && a.rating.charAt(0) === '!' ?
            Math.round(Math.random() * 100) : a.rating,
          color: typeof a.color === 'string' &&  a.color.charAt(0) === '!' ?
            colorScheme.random() : a.color
        }
      })

    const {
      aspect_pairs,
      animating,
      tradeoff
    } = this.state

    const [i, j] = aspect_pairs[0]

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