const HtmlWebPackPlugin = require("html-webpack-plugin")
const InjectPlugin = require('webpack-inject-plugin').default;
const path = require("path")

let pollServer =
  `  let __init_status = false
  console.log("what")
  let __init_magic_reload = async () => {
    debugger
    console.log("(****___INIT CALLED")
      let closed = false
      let createConnection = () => {
          console.log("EH")
          return new Promise((res, rej) => {
              console.log("*****WAHT")

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

      let delay = d => {
          new Promise((res, rej) => {
              setTimeout(res, d)
          })
      }
      
      let tryMany = async () => {
          console.log("TRYMANY CALLED")

          while (true) {
              console.log("creating")
              try {
                  let ret = await createConnection()
                  return ret
              } catch (err) { }
              await delay(2000)
          }
      }
      console.log("*****MAYBE HERE*****")
      let ws = await tryMany()
      ws.onmessage = function (ev) {
          if(closed) return
          if (!__init_status) {
              __init_status = true
          }
          else {
              try {ws.close()} catch(err) {}
              window.location.reload();
          }
      }
      ws.onclose =() => {
        closed=true;
        console.log("***======*CLOSING")
        debugger
        __init_magic_reload();
        }
  }
  debugger
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
    // new InjectPlugin(function () {
    //   return pollServer
    // })
  ],

  entry: {
    javascript: "./src/index.jsx",
    html: "./public/index.html"
  }
}
