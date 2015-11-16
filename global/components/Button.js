import React from 'react'
import Radium from 'radium'

@Radium
class Button extends React.Component {
  static defaultProps = {
    color: '#557',
    background: '#fff',
    border: '#557',
    hover: {
      color: '#fff',
      backgroundColor: '#557'
    }
}

  render () {
    const {
      text,
      handler,
      color,
      background,
      border,
      hover,
      modStyle 
    } = this.props

    return (
      <div 
        style={[{
            ...styles.button,
            color,
            backgroundColor: background,
            boxShadow: '0 0 0 1px ' + border,
            borderRadius: 5,
            ':hover': {
              color: '#fff',
              backgroundColor: '#557'
            },
            ...modStyle
          }]} 
        onClick={handler}
      >
        {text}
      </div>
    )
  }
}

const styles = {
  button: {
    boxSizing: 'border-box',
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    cursor: 'pointer',
    textAlign: 'center'
  }
}

export default Button