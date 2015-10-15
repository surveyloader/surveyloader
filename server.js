import express from 'express'

let server = express()
server.use('/', express.static(__dirname))

let port = process.env.PORT || 3000
server.listen(port)