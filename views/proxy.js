/**

 @Name：先基于node-http-proxy 简单实现的跨域请求，后期使用webpack 中的方法
 @Author：gaoli

 */
var PORT = 8000;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var httpProxy = require('http-proxy');

// var proxyUrl = 'http://114.116.50.179:80/';
var proxyUrl = 'http://114.116.109.71:8000/';
// var proxyUrl = 'http://192.168.30.171:8000/';
// var proxyUrl = 'http://192.168.30.10:8000/';
// var proxyUrl = 'http://127.0.0.1:8000/';
// var proxyUrl = 'http://www.toshadow.net:8000/';


//etlmgr/库表  apidaqmgr/数据采集  接口管理intfmgr/
var filterText=['sysmgr/','compmgr','login/','logout/',
                'flowEngine/','etlmgr/','apidaqmgr/',
                'intfmgr/','vermgr/','szydmgr/',
                'hnlfmgr/','dfsmgr/','yqszydmgr/',
                'devopsmgr','zuul','iiorsmgr/','nerpmgr/',
                'rulemgr/','meetingmgr/','motionmgr/',
    'catalog/', 'reportmgr/', 'sascatalog/', 'sasszrule/', 'sasmeetingmgr/', 'sascommon/',
    'sasprocessmgr','sasinfocfg'
];


var proxy = httpProxy.createProxyServer({
    target: proxyUrl,   //接口地址
    changeOrigin: true
    // 下面的设置用于https
    // ssl: {
    //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
    //     cert: fs.readFileSync('server.crt', 'utf8')
    // },
    // secure: false
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function (request, response) {

    // 添加响应头
    response.setHeader("Access-Control-Allow-Origin", proxyUrl);
    response.setHeader("Access-Control-Allow-Credentials","true");


    // 获取请求路径
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("./", pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    /* if(request.headers.host.indexOf('8080')>0){

     }*/
    /*if(pathname.indexOf('/src/')>0 || pathname.indexOf('login.html')>0  || !pathname.indexOf('/favicon.ico')){
        return;
    }*/

    for (var i=0;i<filterText.length;i++){

        if(pathname.indexOf(filterText[i])>0 && pathname.indexOf('html')<0 && pathname.indexOf('css')<0 && pathname.indexOf('js')<0 && pathname.indexOf('png')<0 ){
            //判断如果是接口访问，则通过proxy转发
            proxy.web(request, response);
            return;
        }

    }


    if (!pathname.indexOf('/favicon.ico')) {
        // 关闭nodejs 默认访问 favicon.ico
        return;
    }

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {

            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    // response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {

                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
