import React from 'react'
import { declare, type } from '../../global/types'
import Radium from 'radium'
import Question from '../../global/components/Question'
import Button from '../../global/components/Button'

@Radium
export default class QuestionForm extends React.Component {
  static propTypes = {
    questions: declare(
      type.Array(
        type.Object({
          type: type.string,
          caption: type.string
        })
      )
    ),
    instructions: declare(type.string),
    submit: declare(type.string)
  }

  static defaultProps = {
    questions: [
      {
        type: 'TextField',
        caption: 'Name:'
      }
    ],
    instructions: 'Please answer the following:',
    submit: 'Submit'
  }

  constructor (props) {
    super(props)
  }

  render () {
    const {
      questions,
      instructions,
      submit
    } = this.props

    return (
      <div>
        {
          instructions &&
          <div style={[styles.panel, styles.padding(1)]}>
            {instructions}
          </div>
        }
        <div style={[
          styles.panel,
          styles.padding(1),
          styles.margin(1, 0, 0, 0)
        ]}>
          <div>
            {
              !!questions.length &&
              questions.map((q, i) => (
                <Question
                  {...q}
                  key={i}
                />
              ))
            }
            <div style={[styles.padding(1, 0, 0, 0)]}>
              <Button
                float={'right'}
                text={submit}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

import gstyles from '../../global/styles'
const styles = {
  ...gstyles
}