let elasticsearchClient = require('./connection.js');


/**
 * 매핑을 설정한다.
 * */
elasticsearchClient.indices.putMapping({
    index: 'car',
    type: 'car_info',
    body: {
        properties: {
            '제조사명': {   //필드명
                type: 'text',
                analyzer: 'korean',
                search_analyzer: "korean"
            },
            '모델명': {
                type: 'text',
                analyzer: 'korean',
                search_analyzer: "korean"
            },
        }
    }
},function(err,resp,status){
    if (err) {
        console.log(err);
    }
    else {
        console.log(resp);
    }
});