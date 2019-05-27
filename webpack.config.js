const HtmlWebPackPlugin = require("html-webpack-plugin")
const InjectPlugin = require('webpack-inject-plugin').default;
const path = require("path")

let pollServer =
  `  let __init_status = false

  let __init_magic_reload = async () => {
  
      let closed = false
      let createConnection = () => {
          return new Promise((res, rej) => {
              var ws = new WebSocket('ws://localhost:40510');
              ws.onopen = function () {
                  console.log('connected')
                  res(ws)
              }
              ws.onerror = function () {
                  rej()
              }
          })
      }
  
      function delay(t, v) {
          return new Promise(function (resolve) {
              setTimeout(resolve.bind(null, v), t)
          });
      }
  
      let tryMany = async () => {
  
          while (true) {
              try {
                  console.log("attempting")
                  let ret = await createConnection()
                  return ret
              } catch (err) { }
              await delay(100)
          }
      }
      let ws = await tryMany()
      ws.onmessage = function (ev) {
  
          if (!__init_status) {
              __init_status = true
          }
          else {
              try { ws.close() } catch (err) { }
              window.location.reload();
          }
      }
      ws.onclose = async () => {
  
          let ws = await tryMany()
          ws.onmessage = function () {
              window.location.reload();
          }
      }
  }
  
  __init_magic_reload()
`


module.exports = {
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  mode: "development",
  devtool: "source-map",
  output: {
    publicPath: '/',
    path: path.join(__dirname, "build"),
  },
  devServer: {
    port: 3000,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: {
      index: '/index.html'
    },
    contentBase: path.join(__dirname, "public"),
    hot: true
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    },
    {
      test: /\.html$/,
      use: [{
        loader: "html-loader"
      }]
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [{
        loader: "url-loader",
        options: {
          limit: 30000,
          name: "[name].[ext]"
        }
      }]
    }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    }),
  ],

  entry: {
    javascript: "./src/index.jsx",
    html: "./public/index.html"
  }
}
