import http from 'superagent'
import modulesList from '../modules/list.json'
import credentials from './credentials'
import browsers from './browsers'

const { user, pass } = credentials.browserstack

function generateScreenshots (moduleType) {
  http
    .post('https://www.browserstack.com/screenshots')
    .auth(user, pass)
    .send({
      url: `http://surveyloader.org/module/?fullscreen/%7B"type"%3A"${moduleType}"%7D`,
      wait_time: 20,
      browsers,
      callback_url: `https://surveyloader.firebaseio.com/screenshots/${moduleType}.json`
    })
    .end((err, res) => {
      if (err) {
        console.error(moduleType, err)
      } else {
        console.log(moduleType, res.body.job_id)
      }
    })
}

modulesList
  .map(m => generateScreenshots(m))