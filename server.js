import express from 'express'

let server = express()

server.use(express.static(__dirname + '/build'))

let loader = require('./loader')
server.get('/task/:name', loader.handle)
server.use('/static', express.static(__dirname + '/static'))
server.use('/folding-survey/static/', express.static(__dirname + '/static'))

let port = process.env.PORT || 3000
server.listen(port)