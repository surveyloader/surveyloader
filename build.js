import webpack from 'webpack'

function pack (dir) {
  let compiler = webpack({
    entry: {
      app: dir + '/src/Index.js'
    },
    output: {
      path: dir + '/',
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/ 
        },
        { 
          test: /\.json$/,
          loader: 'json-loader' 
        },
        { 
          test: /\.(png|jpg|gif|woff|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
          loader: 'url-loader?limit=8192' 
        }
      ]
    },
    plugins: [
      //  new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
  })

  compiler.watch({}, (err, stats) => {
    console.log(stats.toString({ colors: true }))
  })
}

['load', 'config'].map((dir) => pack('./' + dir))