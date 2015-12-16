import React from 'react'
import Radium from 'radium'
import _ from 'lodash'
import { declare, type } from '../../global/types'
import identify from '../../global/services/stringHash'
import store from './store'
import Rate from './RateAspect'
import Rated from './RatedAspects'

@Radium
class Index extends React.Component {
  static propTypes = { 
    aspect_texts: declare(type.array),
    aspect_colors: declare(type.array),
    instructions: declare(type.string),
    text: declare(type.string),
    rating_tip: declare(type.string),
    rating_confirm: declare(type.string),
    min_point: declare(type.string),
    max_point: declare(type.string),
    low_point: declare(type.string),
    high_point: declare(type.string)
  }

  static defaultProps = {
    instructions: 'Instructions',
    text: 'Consider your life over the last year. On average, how would you rate the following aspects of your life during the last year? Please use a scale from 0 to 100, where 0 is the least amount of the aspect you could possibly imagine in anyone’s life and 100 is the most you could possibly imagine in anyone’s life. Notice that ratings above 75 or below 25 are beyond extreme.',
    rating_tip: 'Move the slider to set your rating',
    rating_confirm: 'Confirm Rating',
    low_point: 'extremely low',
    high_point: ' extremely high',
    min_point: 'the least you could possibly imagine',
    max_point: ' the most you could possibly imagine',
    aspect_texts: [
      'one',
      'two',
      'three'
    ],
    aspect_colors: [
      '#f77',
      '#7f7',
      '#77f'
    ]
  }

  static simulate (props) {
    return _(props.aspect_texts)
      .map((a) => [`rating_${identify(a)}`, _.sample(_.range(0,101))])
      .object()
      .value()
  }

  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })
  }

  componentDidMount () {
    store.dispatch({
      type: 'SET_ASPECTS', 
      aspects: this.props.aspect_texts
        .map((a, i) => {
          return {
            text: a,
            color: this.props.aspect_colors[i],
            index: i
          }
        })
    })
  }

  componentDidUpdate () {
    if (this.state.index < 0) {
      this.props.push(
        _(this.state.aspects)
          .map((a) => [`rating_${identify(a.text)}`, a.rating])
          .object()
          .value()
      )
    }
  }

  render () {
    const { aspects, rated, index } = this.state
    const { 
      rating_tip,
      rating_confirm,
      instructions,
      text,
      min_point,
      max_point,
      low_point,
      high_point
    } = this.props
    return (
      <div style={[styles.container]}>
        <div style={[styles.instructions]}>
          <b>{instructions}</b>
          <div>{text}</div>
        </div>
        {
          // index === -1 after all aspects rated
          index > -1 &&
          <Rate
            aspect={aspects[index]}
            handleRating={
              (p) => store.dispatch({
                type: 'CHANGE_RATING',
                rating: p
              })
            }
            handleConfirm={
              (a) => store.dispatch({
                type: 'CONFIRM_RATING',
                aspect: a
              })
            }
            rateText={rating_tip}
            confirmText={rating_confirm}
            minPoint={min_point}
            maxPoint={max_point}
            lowPoint={low_point}
            highPoint={high_point}
          />
        }
        {
          // if any aspects are rated
          rated.length &&
          rated.reduce((a, b) => a || b) &&
          <Rated
            aspects={
              aspects
                .filter((a, i) => rated[i])
            }
            editRating={
              (i) => store.dispatch({
                type: 'EDIT_RATING',
                index: i
              })
            }
            editText={'Edit'}
          />
        }
      </div>
    )
  }
}

import gstyles from '../../global/styles'
const styles = {
  ...gstyles,
  instructions: {
    ...gstyles.panel,
    ...gstyles.padding(2),
    marginBottom: '2rem'
  },
  container: {
    marginTop: 30,
    userSelect: 'none'
  }
}

export default Index