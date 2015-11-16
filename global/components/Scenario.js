import React from 'react'
import Radium from 'radium'

import Aspect from './Aspect'
import Button from './Button'

export default Radium((props) => {
  return (
    <div style={[styles.panel, styles.padding(1)]}>
      {
        props.aspects.map((a) => {
          return (
            <Aspect
              modStyle={{flex: 1}}
              text={a.text}
              rating={a.rating}
              color={a.color}
              delta={a.change}
              deltaText={a.deltaText}
            />
          )
        })
      }
      <Button
        modStyle={{marginTop: '1rem'}}
        text={props.preferText}
        handler={props.handler} 
      />
    </div>
  )
})

import gstyles from '../../global/styles'
const styles = {
  ...gstyles
}