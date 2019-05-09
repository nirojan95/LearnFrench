const HtmlWebPackPlugin = require("html-webpack-plugin")
const InjectPlugin = require('webpack-inject-plugin').default;
const path = require("path")

let pollServer =
  `let __version = undefined

let delay = t => new Promise((res, rej) => setTimeout(() => res(), t))
let checkVersion = async () => {
    await fetch('/__version')
        .then(x => x.text())
        .then(v => {
            __version = v
        })
        

    while (true) {
        await delay(300)
        try {
            let x = await fetch('/__version')
            let newVersion = await x.text()
            if (__version !== newVersion) {
                location.reload();
            }
        } catch (err) { }
    }
}

checkVersion()
`


module.exports = {
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
    new InjectPlugin(function () {
      return pollServer
    })
  ],

  entry: {
    javascript: "./src/index.jsx",
    html: "./public/index.html"
  }
}
