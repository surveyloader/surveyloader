var fs = require('fs')
var webpack = require('webpack')
var Promise = require('bluebird')
Promise.promisifyAll(fs)

function pack (dir) {
  var compiler = webpack({
    entry: {
      app: './modules/' + dir + '/src/Index.js',
    },
    output: {
      path: './modules/' + dir,
      filename: 'bundle.js'
    },
    externals: {
      'react': 'React',
      'radium': 'Radium',
      'bluebird': 'Promise',
      'lodash': '_',
      'd3': 'd3'
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.(png|jpg|gif|woff|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=8192' }
      ]
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
  })

  compiler.watch({}, function (err, stats) {
    console.log(stats.toString({ colors: true }))
  })
}

fs
  .readdirAsync(__dirname + '/modules')
  .then(function (data) {
    data.map(function (f) {
      fs
        .statAsync(__dirname + '/modules/' + f)
        .then(function (stats) {
          if (stats.isDirectory()) {
            pack(f)
          }
        })
    })
  })