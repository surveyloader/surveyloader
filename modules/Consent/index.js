import React, { PropTypes } from 'react'
import Radium from 'radium'

import Button from '../../global/components/Button'

@Radium
class Consent extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    agree: PropTypes.string.isRequired,
    continue: PropTypes.string.isRequired
  }

  static simulate (props) {
    return null
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
              modStyle={{float:'right', marginTop: '1rem'}}
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
    width: '100%',
    borderRadius: 15,
    boxShadow: '2px 2px 4px #ddd',
    margin: '15px auto 60px auto',
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