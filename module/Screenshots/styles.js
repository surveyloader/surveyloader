import parent from '../styles'

export default {
  ...parent,
  item: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '0.1rem solid #ddd',
    cursor: 'zoom-in',
    ':hover': {
      backgroundColor: '#ddd'
    }
  },
  thumb: {
    float: 'left',
    paddingRight: '0.5rem'
  },
  line: {
    display: 'block'
  }
}