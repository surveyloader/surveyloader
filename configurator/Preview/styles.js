import parent from '../styles'

export default {
  ...parent,
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