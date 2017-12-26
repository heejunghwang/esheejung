let elasticsearchClient = require('./connection.js');
let appDir = require('../main.js');
appDir = appDir.replace(new RegExp(/\\/g),"/")


/**
 * 인덱스를 생성한다
 */
elasticsearchClient.indices.create({
    index: 'car',
    body:{
        "settings": {
            "index" : {
                "analysis":{
                    "filter" : {
                        "test_synonym" : {
                            "type": "synonym",
                            "synonyms_path": "synonym.txt", //유의어사전은 elasticsearch_home하위 config 폴더 하위에 위치하도록 한다. 샘플 유의어 파일은 data/synonym.txt에 있음
                            "tokenizer": "seunjeon_default_tokenizer"
                        }
                    },
                    "analyzer": {
                        "korean": {
                            "type": "custom",
                            "tokenizer": "seunjeon_default_tokenizer",
                            "filter": ["test_synonym","lowercase", "trim"]
                        }
                    },
                    "tokenizer": {
                        "seunjeon_default_tokenizer": {
                            "type": "seunjeon_tokenizer",
                            "index_eojeol": false,
                            "user_dict_path": [appDir + "/data/customdic.csv"] //사용자 사전
                        }
                    }
                }
            }
        }
    }
},function(err,resp,status) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("create",resp);
    }
});
