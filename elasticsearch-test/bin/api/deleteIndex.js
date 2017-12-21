let elasticsearchClient = require('./connection.js');

/**
 * 인덱스를 삭제한다.
 */
elasticsearchClient.indices.delete({index: 'car'},function(err,resp,status) {
    console.log("delete",resp);
});
