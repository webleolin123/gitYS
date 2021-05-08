/**

 @Name：webpack development config
 @des:  webpack 开发环境打包
 @Author：gaoli
 @UpdateTime : 2019-05-28

 */
const path = require('path'); //node内置模块，用来设置路径
var HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');//js代码压缩器
const CleanWebpackPlugin = require('clean-webpack-plugin');//清除文件

var isProd = process.env.NODE_ENV === 'production'; // true or false

module.exports = {
    mode: 'development',
    // entry: require('./webpack-config/entry.config'),
    // entry: './src/js/module/pageCustom.js',
    // output: {
    //     path: __dirname + '/dist',
    //     filename: './src/js/module/pageCustom.bundle.js'
    // },
    entry: {
        "index": './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    plugins: [
        new CleanWebpackPlugin(pathsToClean),
        new HtmlWebpackPlugin({
            template: "./src/page/custom/config.html",
            filename: 'config.html',
            minify: {
                collapseWhitespace: true,
            },
            hash: true,
        }),
        new UglifyJSPlugin({
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            },
            output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
            }
        }),
        // new ExtractTextPlugin("css/[name].css")
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules|bootstrap/,
                // loader: 'style!css?minimize&-autoprefixer!postcss',
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                include: /bootstrap/,
                use: [
                    'style-loader', 'css-loader',
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 8088,
        open: true,
        hot: true
    }
};

