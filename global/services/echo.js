function echo (param, table) {
  if (/\$\(.+\)/.test(param)) {
    let nested = param.replace(/\$\((.+)\)/, (m, p1) => {
      return echo(`$${p1}`, table)
    })
    return echo(nested, table)
  } else {
    return /\$.+/.test(param) ?
      echo(table[param.substring(1)], table) :
      param || '404'
  }
}

export default echo