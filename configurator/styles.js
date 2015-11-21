import styles from '../global/styles'
export default {
  ...styles,
  main: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    width: '100%',
    minWidth: 640,
    maxWidth: 1200,
    minHeight: '100%',
    left: 0,
    top: 0,
    backgroundColor: '#fff',
    fontFamily: 'Courier',
    fontSize: '1em',
    color: '#333',
    boxSizing: 'border-box'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '1.125em',
    paddingTop: '0.5rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem'
  }
}