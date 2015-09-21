import React, { PropTypes } from 'react'
import Radium from 'radium'
import _ from 'lodash'

import { Simulate, PrePropType as Pre }
from '../../../global/services/pre/'
import identify
from '../../../global/services/stringHash'

import store from './store'

import Rate from './RateAspect'
import Rated from './RatedAspects'

@Radium
class Index extends React.Component {
  static propTypes = { 
    aspects: PropTypes.array
  }

  static defaultProps = {
    instructions: 'Instructions',
    text: 'Please imagine a scale from 0 to 100 where 0 represents worst possible situation and 100 the best possible situation. On this scale how would you rate the following aspects of your life?',
    rating_tip: 'Move the slider to set your rating',
    rating_confirm: 'Confirm Rating',
    aspects: ['one', 'two']
  }

  static output = {
    $hash$_rating: Pre.number.of(_.range(0,101))
  }

  static simulate (props) {
    return _(props.aspects)
      .map((a) => [identify(a) + '_rating', _.sample(_.range(0,101))])
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
      aspects: this.props.aspects
        .map((a, i) => {
          return {
            text: a,
            index: i
          }
        })
    })
  }

  componentDidUpdate () {
    if (this.state.index < 0) {
      this.props.push(
        _(this.state.aspects)
          .map((a) => [identify(a.text) + '_rating', a.rating])
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
      text
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

const styles = {
  container: {
    marginTop: 30,
    userSelect: 'none'
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

export default Index