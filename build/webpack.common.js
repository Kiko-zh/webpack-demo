/**
 * HtmlWebpackPlugin 會在打包結束後, 自動生成一個html文件,
 * 并把打包生成的js文件自動引入到這個html文件中
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path') // node核心模塊

module.exports = {
  entry: {
    main:  './src/index.js' // 打包index.js 默認生成的文件名是main.js
  },
  module: { // 模塊
    rules: [
      { // img 校驗規則
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader', // 需要安裝 打包圖片/txt/等
          options: {
            // placeholder 佔位符
            name: '[name].[ext]', // 與打包前的名字和後綴名一樣
            // name: '[name]_[hash].[ext]', // 與打包前的名字和後綴名一樣, 名字後面加上hash
            outputPath: 'images/', // 將圖片打包到dist文件夾下的images文件夾裏
            limit: 2048 // 小於2Kb 打包在bundle.js中以base64展示, 大於2kb就打包在dist/images文件夾下
          }
        }
      } ,
      { // 校驗scss規則
        test: /\.scss$/,
        use:  [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 保證index.scss裏引入的其他scss文件也會執行postcss&sass兩個loader文件
              // modules: true // 開啓CSS MODULE
            }
          },
          'sass-loader',
          'postcss-loader'
        ] // loader是從下到上, 從右到左的執行順序
      },
      { // 校驗css規則
        test: /\.css$/,
        use:  [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 保證index.scss裏引入的其他scss文件也會執行postcss&sass兩個loader文件
              // modules: true // 開啓CSS MODULE
            }
          },
          'postcss-loader'
        ] // loader是從下到上, 從右到左的執行順序
      },
      { // 打包字體文件
        test: /\.(eot|ttf|svg|woff)$/,
        use: {
          loader: 'file-loader'
        }
      },
      { // babel-loader轉換ES6變成瀏覽器可識別的ES5語法
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules 不使用babel
        loader: 'babel-loader',
        // options: 
      }
    ]
  },
  output: { // 打包輸出的路徑
    // publicPath: 'http://cdn.com.cn', // dist->index.html注入的js文件默認就會帶上publicPath
    // filename: 'bundle.js', // 打包後的文件名
    filename: '[name].js', // 打包後的文件名, [name]佔位符, 最終就是替代entry裏的main & sub
    // path: path.resolve(__dirname, 'dist') // 打包的文件所在的文件夾名稱, __dirname指webpack.config.js所在的文件夾路徑
    path: path.resolve(__dirname, '../dist') // 打包的文件所在的文件夾名稱, __dirname指webpack.config.js所在的文件夾路徑
  },
  // plugin可以在webpack運行到某個時刻的時候, 幫你做一些事情, 類似hook生命周期函數
  plugins: [
    // 打包之後運行HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      // template: `./src/index.html`
      template: `src/index.html`
    }),
    // 打包之前 會使用CleanWebpackPlugin插件清除 dist目錄
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all' // async只对异步代码有效, all对同步异步都有效, initial只对同步代码有效
      // minSize: 30000, // 引入的库大于30000kb才会做 代码分割 与cacheGroups有关系
      // minChunks: 2, // 至少被引入1次, 就会被切割
      // maxAsyncRequests: 6, // 同时加载的模块最多6个请求
      // maxInitialRequests: 4, // 入口文件进行加载的时候, 入口文件最多也是分割4个js文件
      // automaticNameDelimiter: '~', // 文件的连接符
      // cacheGroups: { // 缓存组
      //   // vendors: false, // 异步时不用配置
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10, // 值越大, 优先级越高
      //     // filename: "vendors.js"
      //   },
      //   default: {
      //     priority: -20,
      //     reuseExistingChunk: true, // 如果一个模块已经被打包过了, 直接使用, 不会重复打包
      //     filename: "common.js"
      //   }
      // }
    }
  }
}