import React from 'react'
import ArrayParam from './ArrayParam'
import ObjectParam from './ObjectParam'
import LeafParam from './LeafParam'


export default (props) => {
  const [type, subtype] = props.schema
  switch (type) {
    case 'string':
      return <LeafParam {...props} />

    case 'number':
      return <LeafParam {...props} />

    case 'boolean':
      return <LeafParam {...props} />

    case 'function':
      return null

    case 'array':
      return (
        <ArrayParam
          {...props}
          elementSchema={subtype.schema || ['string', false]}
          value={props.value || []}
        />
      )

    case 'object':
      return (
        <ObjectParam
          {...props}
          propertySchemas={subtype}
          value={props.value || {}}
        />
      )

    default:
      return <span>Error?</span>
  }
}