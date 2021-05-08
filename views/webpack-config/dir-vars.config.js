/**
 @Name：文件打包 以及 代理基础配置
 @Author：gaoli
 @Updatetime：2019-05-28
 */

var path = require('path');

var moduleExports = {};

moduleExports.staticRootDir = path.resolve(__dirname, '../../'); // 项目根目录

moduleExports.jsDir = path.resolve(moduleExports.staticRootDir, './src/js'); //要进行打包的js文件

moduleExports.htmlDir = path.resolve(moduleExports.staticRootDir, './src/page');//html 页面

moduleExports.proxyLoc ='http://192.168.0.149:8081/';//代理地址

moduleExports.buildDir = path.resolve(moduleExports.staticRootDir, '/build/'); // 打包生成目录

module.exports = moduleExports;
