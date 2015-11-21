import parent from '../styles'

export default {
  ...parent,
  row: {
    ...parent.row,
    justifyContent: 'center',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem'
  },
  col: {
    ...parent.col,
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem'
  },
  label: {
    textAlign: 'right'
  },
  hover: {
  }
}