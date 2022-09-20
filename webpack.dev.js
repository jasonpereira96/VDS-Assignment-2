const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './src/index.js'
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    })
  ]
};