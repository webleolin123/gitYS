var gulp            = require('gulp'),
    clean           = require('gulp-clean'),
    changed         = require('gulp-changed'),
    htmlmin         = require('gulp-htmlmin'),
    pump            = require('pump'),
    sequence        = require('run-sequence');

var config = {
    src: "src/page/ys",
    dist: "build/src/page/ys"
};

/**
 * 清理目标目录
 */
gulp.task('clean', function(cb) {
    pump([
        gulp.src(config.dist),
        clean()
    ], cb)
});

/**
 * 执行html压缩
 */
gulp.task('minify:html', [], function(cb) {

    pump([
        // 获取原目录下所有的html文件
        gulp.src(config.src + "/**/*.html"),
        // 每次打包时，只打包内容发生改变的文件
        changed(config.dist, { extension:'.html' }),
        // 执行html压缩
        htmlmin({
            removeComments: true,               // 清除HTML注释
            collapseWhitespace: true,           // 压缩空格
            collapseBooleanAttributes: true,    // 省略布尔属性的值 <input checked="true"/> => <input checked>
            removeEmptyAttributes: true,        // 删除所有空格作属性值 <input id=""> => <input>
            removeScriptTypeAttributes: true,   // 删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"
            minifyJS: true,                     // 压缩页面JS
            minifyCSS: true                     // 压缩页面CSS
        }),
        // 输出至目标目录
        gulp.dest(config.dist)

    ], cb);

});

/**
 * 监控
 */
// gulp.task('watch', [], function(cb) {

//     gulp.watch(config.src + "/**/*.html", ['minify:html']);

// });

/**
 * 开始执行
 */
gulp.task('default', function(cb) {
    sequence('clean', 'minify:html', cb);
});
