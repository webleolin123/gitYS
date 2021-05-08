/**

 @Name：webpack entry
 @des:  入口设置
 @Author：gaoli
 @UpdateTime : 2019-05-29

 */
const dirVars = require('./../webpack-config/dir-vars.config.js');
const glob = require('glob');
const path = require('path');
const fs = require('fs');




function getEntries() {
    let entries = {};

    return entries;
}

let entries = getEntries();
module.exports = entries;



