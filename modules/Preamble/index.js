import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { declare, type } from '../../global/types'
import Button from '../../global/components/Button'
import Scenario from '../../global/components/Scenario'

@Radium
class Preamble extends React.Component {
  static simulate (props) {
    return {
      preamble_start: 0,
      preamble_finish: 0
    }
  }

  static propTypes = {
    instructions_title: declare(type.string),
    button_skip: declare(type.string),
    button_continue: declare(type.string),
    instructions: declare(type.Array(type.string)),
    text_prefer_option: declare(type.string),
    aspects: declare(
      type.Array(
        type.Object({
          text: type.string,
          rating: type.number,
          color: type.string
        })
      )
    ),
    tradeoff: declare(type.Array(type.number)),
    texts_deg_pref: declare(type.array),
    text_increases: declare(type.string),
    text_decreases: declare(type.string),
    text_you_chose: declare(type.string),
    text_instead: declare(type.string)
  }

  static defaultProps = {
    instructions_title: 'Instructions',
    button_skip: 'Skip',
    button_continue: 'Continue',
    instructions: [
      'In the following section you will be asked for your preference between various life scenarios.',
      'Suppose some of the aspects of your life you previously rated could be increased or decreased.',
      'For instance, imagine in one scenario, your ',
      'Imagine in another scenario your ',
      'Of these two scenarios, which option would you prefer? (Please choose which option you would prefer with the buttons below).'
    ],
    text_prefer_option: 'I prefer this option',
    aspects: [
      {
        text: 'one',
        rating: 51,
        color: '#f77'
      },{
        text: 'two',
        rating: 52,
        color: '#7f7'
      }
    ],
    tradeoff: [4, 4],
    texts_deg_pref: [
      'slightly',
      'moderately',
      'strongly',
      'greatly'
    ],
    text_increases: 'increases',
    text_decreases: 'decreases',
    text_you_chose: 'You chose the scenario where your',
    text_instead: 'over the scenario where your'
  }

  constructor (props) {
    super(props)
    this.state = {
      step: 0,
      choice: false,
      preamble_start: Date.now()
    }
  }

  deltaText (delta) {
    const {
      texts_deg_pref,
      text_increases,
      text_decreases
    } = this.props
    const increases_decreases = delta < 0 ?
      text_decreases : text_increases
    const { floor, log, LN2, abs } = Math
    const log2 = log(abs(delta)) / LN2
    const degree = texts_deg_pref[floor(log2)] || ''
    return `${degree} ${increases_decreases}`
  }

  choose (option) {
    if (this.state.step > 3) {
      this.setState({ choice: option })
    }
  }

  continue () {
    const {
      step,
      choice,
      preamble_start
    } = this.state

    if (choice) {
      this.props.push({
        preamble_choice: choice,
        preamble_start,
        preamble_finish: Date.now()
      })
    } else {
      this.setState({ step: step + 1 })
    }
  }

  skip () {
    const {
      step,
      preamble_start
    } = this.state
    
    this.props.push({
      preamble_skip: step,
      preamble_start,
      preamble_finish: Date.now()
    })
}

  render () {
    const {
      instructions_title,
      button_skip,
      button_continue,
      instructions,
      aspects,
      text_prefer_option,
      tradeoff,
      text_you_chose,
      text_instead
    } = this.props

    const {
      step,
      choice
    } = this.state

    return (
      <div>
        <div style={[styles.instructions]}>
          <div style={[styles.steps]}>
          {
            _.range(step + 1)
              .map((i) => (
                <svg
                  width={'1rem'}
                  height={'1rem'}
                  key={i}
                  style={[styles.circle]}
                  onClick={() => this.setState({ step: i })}
                >
                  <circle
                    cx={'0.5rem'}
                    cy={'0.5rem'}
                    r={'0.25rem'}
                    fill={step === i ? '#000' : '#ddd'}
                  />
                </svg>
              ))
          }
          </div>
          {
            step < 4 &&
            <Button
              text={button_skip}
              modStyle={{ fontSize: '0.75rem' }}
              handler={() => ::this.skip()}
            />
          }
          <div style={[styles.heading]}>{instructions_title}</div>
          {
            !choice &&
            <p key={step} style={[styles.textBody]}>
            {
              instructions[step]
            }
            {
              step === 2 &&
              `${aspects[0].text} ${this.deltaText.bind(this)(tradeoff[0])}.`
            }
            {
              step === 3 &&
              `${aspects[1].text} ${this.deltaText.bind(this)(tradeoff[1])}.`
            }
            </p>
          }
          {
            choice &&
            <p key={choice} style={[styles.textBody]}>
            {
              text_you_chose
            }
            {
              choice === 1 &&
              ` ${aspects[0].text} 
              ${this.deltaText.bind(this)(tradeoff[0])} 
              ${text_instead} 
              ${aspects[1].text}
              ${this.deltaText.bind(this)(tradeoff[1])}.`
            }
            {
              choice === 2 &&
              ` ${aspects[1].text} 
              ${this.deltaText.bind(this)(tradeoff[1])} 
              ${text_instead} 
              ${aspects[1].text}
              ${this.deltaText.bind(this)(tradeoff[0])}.`
            }
            </p>
          }
          {
            (choice || step < 4) &&
            <Button
              text={button_continue}
              color={'#fff'}
              background={'#779'}
              hoverFontColor={'#557'}
              hoverBackColor={'#fff'}
              handler={() => ::this.continue()}
            />
          }
        </div>
        <div style={[styles.row]}>
          <div style={[
            styles.padding(1, 0.5, 0, 0),
            {
              flex: 1,
              opacity: choice === 2 ? 0.5 : 1
            }
          ]}>
          {
            step > 1 &&
            <Scenario
              aspects={[
                {
                  text: aspects[0].text,
                  rating: aspects[0].rating,
                  color: aspects[0].color,
                  change: tradeoff[0],
                  deltaText: this.deltaText.bind(this)(tradeoff[0])
                }, {
                  text: aspects[1].text,
                  rating: aspects[1].rating,
                  color: aspects[1].color,
                  change: 0,
                  deltaText: null
                }
              ]}
              preferText={text_prefer_option}
              handler={() => ::this.choose(1)}
            />
          }
          </div>
          <div
            style={[
              styles.padding(1, 0, 0, 0.5),
              {
                flex: 1,
                opacity: choice === 1 ? 0.5 : 1
              }
          ]}>
          {
            step > 2 &&
            <Scenario
              aspects={[
                {
                  text: aspects[0].text,
                  rating: aspects[0].rating,
                  color: aspects[0].color,
                  change: 0,
                  deltaText: null
                }, {
                  text: aspects[1].text,
                  rating: aspects[1].rating,
                  color: aspects[1].color,
                  change: tradeoff[1],
                  deltaText: this.deltaText.bind(this)(tradeoff[1])
                }
              ]}
              preferText={text_prefer_option}
              handler={() => ::this.choose(2)}
            />
          }
          </div>
        </div>
      </div>
    )
  }
}

const fadeIn = Radium.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})

import gstyles from '../../global/styles'
const styles = {
  ...gstyles,
  instructions: {
    ...gstyles.panel,
    ...gstyles.padding(1)
  },
  steps: {
    float: 'left'
  },
  circle: {
    cursor: 'pointer'
  },
  textBody: {
    fontStyle: 'italic',
    animation: `${fadeIn} 1s ease`
  }
}

export default Preamble