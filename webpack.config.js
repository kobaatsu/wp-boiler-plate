const webpack = require('webpack') // eslint-disable-line

module.exports = {
  entry: './src/asset/js/main.js',
  output: {
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  }
}
