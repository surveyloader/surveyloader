import { transform } from 'babel'
import http from 'superagent'
import fs from 'fs'
import Promise from 'bluebird'
Promise.promisifyAll(fs)

export function handle (req, res) {
  fs
    .readFileAsync('./build/bundle.js', 'utf8')
    .then(vendor => {
      http
        .get('localhost:3000/static/tasks/' + req.params.name + '/build/bundle.js')
        .set('Accept', 'application/javascript')
        .buffer()
        .end((error, response) => {
          res
            .type('application/javascript')
            .send(response.text)
        })
    })
}