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
        style={[
          styles.button, 
          { 
            color: color,
            backgroundColor: background,
            boxShadow: '0 0 0 1px ' + border,
            borderRadius: 5,
            ':hover': hover
          }, 
          modStyle
        ]} 
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
    padding: 15,
    margin: 0,
    cursor: 'pointer',
    textAlign: 'center'
  }
}

export default Button