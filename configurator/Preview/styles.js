import parent from '../styles'

export default {
  ...parent,
  main: {
    position: 'absolute',
    width: '100%',
    minWidth: 640,
    minHeight: '100%',
    left: 0,
    top: 0,
    backgroundColor: '#ddf',
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '1.5em',
    color: '#333',
    boxSizing: 'border-box'
  },
  container: {
    position: 'relative',
    width: '100%',
    marginTop: '2rem',
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    '@media (min-width:1000px)': {
      width: 1000
    },
    '@media (max-width:600px)': {
      width: 600
    }
  },
  preview: {
    boxSizing: 'border-box',
    minWidth: '100%',
    height: 600,
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    overflowY: 'scroll',
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '1.25em',
    padding: 30,
    backgroundColor: '#ddf',
    border: '1em solid #000'
  }
}