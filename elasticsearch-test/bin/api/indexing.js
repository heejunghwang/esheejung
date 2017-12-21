let elasticsearchClient = require('./connection.js');

/**
 * 인덱스를 설정한다
 */
elasticsearchClient.indices.create({
    index: 'car'
},function(err,resp,status) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("create",resp);
    }
});