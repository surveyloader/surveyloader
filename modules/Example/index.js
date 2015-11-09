import React, {
  Component,
  PropTypes
} from 'react'

import $ from '../../global/services/clean'
import Button from '../../global/components/Button'

class Example extends Component {
  static propTypes = {
    question_text: PropTypes.string,
    answer_yes: PropTypes.string,
    answer_no: PropTypes.string
  }

  static defaultProps = {
    question_text: 'Do you agree with this question?',
    answer_yes: 'Yes',
    answer_no: 'No'
  }

  static simulate () {
    return {
      example_answer: Math.random() > 0.5 ? 'Yes' : 'No',
      example_time: Date.now()
    }
  }

  constructor (props) {
    super(props)
  }

  handleResponse (answer) {
    this.props.push({
      example_answer: answer,
      example_time: Date.now()
    })
  }

  render () {
    const {
      question_text,
      answer_yes,
      answer_no
    } = this.props

    return (
      <div>
        <p>{question_text}</p>
        <div>
          <Button
            text={answer_no}
            handler={() => {
              ::this.handleResponse(answer_no)
            }}
          />
          <Button
            text={answer_yes}
            handler={() => {
              ::this.handleResponse(answer_yes)
            }}
          />
        </div>
      </div>
    )
  }
}

export default Example