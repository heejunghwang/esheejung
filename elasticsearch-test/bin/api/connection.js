let appDir = require('../main.js');

let properties = require(appDir+'/config/properties.js');

/**
 * 엘라스틱 서치 연결을 위한 모듈
 * @type {es}
 */

let elasticsearch = require('elasticsearch');

let elasticsearchClient = new elasticsearch.Client({
    host: properties.get('local.elasticsearch.host'),
    keepAlive : false,
    log: 'trace'
});

/**
 Elasticsearch Health check
 */
/*
elasticsearchClient.cluster.health({},function(err,resp,status) {
    console.log("-- Client Health --",resp);
});
*/

module.exports = elasticsearchClient;