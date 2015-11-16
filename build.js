import webpack from 'webpack'
import fs from 'fs'

function pack (dir, options) {
  webpack({
    entry: {
      app: dir + '/index.js'
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
        { // for third-party minified scripts, don't process require()
          test: /\.min\.js$/,
          include: /(node_modules|bower_components)/,
          loader: 'script'
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
    ],
    ...options
  })
  .watch({}, (err, stats) => {
    console.log(stats.toString({ colors: true }))
  })
}

let modules = fs
  .readdirSync(`${__dirname}/modules`)
  .filter(f => fs.statSync(`${__dirname}/modules/${f}`).isDirectory())

fs.writeFile(`${__dirname}/modules/list.json`, JSON.stringify(modules))

let imp = modules
  .map((m) => `import ${m} from './${m}'`)
  .join('\n')

let exp = modules
  .map((m) => `export { ${m} }`)
  .join('\n')

fs.writeFile(`${__dirname}/modules/index.js`, `${imp}\n${exp}`)

pack('./run')
pack('./configurator')
pack('./simulator')
pack('./data')
pack('./docs')
pack('./module')