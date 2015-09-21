import Promise from 'bluebird'
import http from 'superagent'

export default function (name) {
  return new Promise((resolve, reject) => {
    http
      .get('/folding-survey/static/modules/' + name + '/bundle.js')
      .accept('application/javascript')
      .end((err, res) => {
        if (err) reject('404')
        resolve(eval(res.text))
      })
  })
}