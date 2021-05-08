/**

 @Name：webpack development config
 @des:  webpack 开发环境打包
 @Author：gaoli
 @UpdateTime : 2019-05-28

 */

const dirVars = require('./webpack-config/dir-vars.config.js');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

module.exports = {
    mode: 'development',
    // entry: require('./webpack-config/entry.config'),
    entry: {
        index: path.resolve(__dirname, './src/module/index.js'),
        login: path.resolve(__dirname, './src/module/login.js')
    },
    output: {},
    module: {},
    plugins: require('./webpack-config/plugins.config'),
    resolve: {
        // 当require的模块找不到时，尝试添加这些后缀后进行寻找
        extensions: ['.js', '.css', '.scss'],
        // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名
        alias: {
            '$': path.join(dirVars.staticRootDir, '../src/js/lib/jquery.1.9.1.js'),
            "modules": path.join(dirVars.staticRootDir, '../src/js/modules'),
            'common': path.join(dirVars.staticRootDir, '../src/js/common/common.js'),
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "utils",
                    minChunks: 7,//分离前，该块被引入的次数
                    maxInitialRequests: 5,//一个入口文件可以并行加载的最大文件数量
                    minSize: 100000,//分离前的最小块文件大小，单位为字节
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    externals: {
        "jquery": '$',
        "echarts": "echarts",
    },
    devServer: {
        contentBase: dirVars.buildDir,
        publicPath: '/build/', //公用的一些路径
        historyApiFallback: true,
        host: '127.0.0.1', //本地地址
        port: 8089, // 默认8080
        inline: true, // 可以监控js变化
        open: true,  //自动打开页面
        hot: true, // 热启动
        compress: true, //压缩
        watchContentBase: true, //监听
        proxy: {
            '/sysmgr': {
                target: dirVars.proxyLoc,
                secure: false,// 接受 运行在 https 上的服务
                // pathRewrite: {'^/sysmgr' : ''},
                changeOrigin: true
            }
        }
    }


};
