require('babel/register')
require('./server')
var webpack = require('webpack')

var compiler = webpack({
  entry: {
    app: './src/Index.js'
    // vendor: ['react', 'radium', 'bluebird', 'lodash', 'd3']
  },
  output: {
    path: './build',
    filename: 'bundle.js'
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
    //  new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
})

compiler.watch({}, function (err, stats) {
  console.log(stats.toString({ colors: true }))
})