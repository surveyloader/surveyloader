import http from 'superagent'
import credentials from './credentials'

const { user, pass } = credentials.browserstack

const browsers = [
  {
    browser: 'chrome'
  },{
    browser: 'firefox'
  },{
    browser: 'ie'
  },{
    browser: 'safari'
  },,{
    browser: 'opera'
  },{
    browser: 'Mobile Safari'
  },{
    browser: 'Android Browser'
  },
]

http
  .post('https://www.browserstack.com/screenshots')
  .auth(user, pass)
  .send({
    url: 'http://surveyloader.org/module/?type=Headers',
    wait_time: 5
  })
  .end((err, res) => {
    console.log(res)
  })