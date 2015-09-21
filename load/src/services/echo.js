function echo (param, table) {
  return /\$.+/.test(param) ?
    echo(table[param.substring(1)], table) :
    param || 'Error'
}

export default echo