import Promise from 'bluebird'
import http from 'superagent'
import _ from 'lodash'

import load from './lazy'
import echo from './echo'

function assignProps (params, table) {
  return  _(params)
    .map((v, k) => {
      return Array.isArray(v) ?
        [k, v.map(subv => echo(subv, table))] :
        [k, echo(v, table)]
    })
    .object()
    .value()
}

function simulateOver (table, queue) {
  return new Promise((resolve, reject) => {
    if (!queue.length) {
      resolve(table)
    } else {
      load(queue[0].type)
        .then((component) => {
          component.defaultProps = component.defaultProps ? component.defaultProps : {}
          component.defaultProps = _
            .assign(component.defaultProps, assignProps(queue[0], table))
          let simulated = component.simulate(component.defaultProps)
          simulateOver({...table, ...simulated}, queue.slice(1))
            .then((table) => resolve(table))
        })
    }
  })
}

export default simulateOver