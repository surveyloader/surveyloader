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
  if (!queue.length) {
    return table
  } else {
    let component = load(queue[0].type)
    component.defaultProps = component.defaultProps ? component.defaultProps : {}
    component.defaultProps = _.assign(component.defaultProps, assignProps(queue[0], table))
    let simulated = component.simulate(component.defaultProps)
    return simulateOver({...table, ...simulated}, queue.slice(1))
  }
}

export default simulateOver