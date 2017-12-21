/**
 * 프로퍼티 import
 */
let PropertiesReader = require('properties-reader');

//bin 하위 프로퍼티 경로
let __appDir = require('../main.js');

//프로퍼티 파일
let properties = PropertiesReader(__appDir+'/config/loc.properties');

module.exports = properties;