function echo (param, table) {
  return /\$.+/.test(param) ?
    echo(table[param.substring(1)], table) :
    param || 'error'
}

export default echo