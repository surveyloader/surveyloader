export default {
  column: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  row: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  panel: {
    boxSizing: 'border-box',
    flex: 1,
    borderRadius: '1rem',
    boxShadow: '0.2rem 0.2rem 0.4rem #ddd',
    background: '#fff'
  },
  padding: (t, r, b, l) => {
    return {
      paddingTop: `${t}rem`,
      paddingRight: `${isNaN(r) && t || r}rem`,
      paddingBottom: `${isNaN(b) && t || b}rem`,
      paddingLeft: `${isNaN(l) && t || l}rem`
    }
  },
  margin: (t, r, b, l) => {
    return {
      marginTop: `${t}rem`,
      marginRight: `${r || t}rem`,
      marginBottom: `${b || t}rem`,
      marginLeft: `${l || t}rem`
    }
  }
}