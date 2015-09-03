import React, { PropTypes } from 'react'
import Radium from 'radium'

import Button from '../../../global/components/Button'

@Radium
class Consent extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    agree: PropTypes.string.isRequired,
    continue: PropTypes.string.isRequired
  }

  render () { 
    return (
      <div style={[styles.container]}>
        <div 
          dangerouslySetInnerHTML={{__html: this.props.body}}
        ></div>
        <div>
          <label>
            <input
              type="checkbox"
              style={[styles.checkbox]}
              onChange={() => this.setState({agreed: !this.state.agreed})}
            />
            <b>{' ' + this.props.agree}</b>
          </label>
          <div style={[styles.clearfix]}>
          {
            this.state.agreed &&
            <Button
              modStyle={{float:'right'}}
              text={this.props.continue}
              handler={() => this.props.push()}
            />
          }
          </div>
        </div>
      </div> 
    )
  }
}

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '50%',
    minWidth: 800,
    borderRadius: 15,
    margin: '15px auto',
    padding: 30,
    background: '#fff'
  },
  checkbox: {
    fontSize: '2em'
  },
  clearfix: {
    overflow: 'hidden',
    padding: 5
  }
}

export default Consent