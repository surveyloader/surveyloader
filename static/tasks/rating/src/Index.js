import React, { PropTypes } from 'react'
import Radium from 'radium'

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
    push: PropTypes.func.isRequired,
    $aspect$$_text: PropTypes.array.isRequired
  }

  static defaultProps = {
    rating_tip: 'Move the slider to set your rating',
    rating_confirm: 'Confirm Rating'
  }

  constructor () {
    super()
    this.state = store.getState()
    store.subscribe(() => {
      this.setState(store.getState())
    })
  }

  componentDidMount () {
    store.dispatch({
      type: 'SET_ASPECTS', 
      aspects: Object.keys(this.props)
        .filter((p) => /\$aspect\d+\$_text/.test(p))
        .map((p) => { return { text: this.props[p] }})
    })
  }

  componentDidUpdate () {
    if (this.state.index < 0) {
      let response = {}
      this.state.aspects.map((a) => {
        response[identify(a.text) + '_rating'] = a.rating
      })
      this.props.push(response)
    }
  }

  render () {
    const { aspects, rated, index } = this.state
    const { rating_tip, rating_confirm } = this.props
    return (
      <div style={[styles.container]}>
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
  }
}

export default Index