var fs = require('fs')
var webpack = require('webpack')
var Promise = require('bluebird')
Promise.promisifyAll(fs)

function pack (dir) {
  var compiler = webpack({
    entry: {
      app: './tasks/' + dir + '/src/index.js',
      // vendor: ['react', 'radium', 'bluebird', 'lodash', 'd3']
    },
    output: {
      path: './tasks/' + dir + '/build',
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
      // new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
      // new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
  })

  compiler.watch({}, function (err, stats) {
    console.log(stats.toString({ colors: true }))
  })
}

fs
  .readdirAsync(__dirname + '/tasks')
  .then(function (data) {
    data.map(function (f) {
      fs
        .statAsync(__dirname + '/tasks/' + f)
        .then(function (stats) {
          if (stats.isDirectory()) {
            pack(f)
          }
        })
    })
  })

// fs.watch('./src', function (event, filename) {
//   console.log('event is: ' + event)
//   if (filename) {
//     console.log('filename provided: ' + filename)
//   } else {
//     console.log('filename not provided')
//   }
// })