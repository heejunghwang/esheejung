은전한잎s 다운로드
- 링크
```
https://bitbucket.org/eunjeon/seunjeon/src/dba5dfd60998b51afde5f3ea6fa74368e8b50b9a/elasticsearch/?at=master
```
-  elasticsearch-analysis-seunjeon-5.1.1.1.zip 다운 받은 후, plugin-descriptor.properties 의 elasticsearch.version 을 변경하여 **재압축**

- elasticsearch home/bin에서 아래 명령어 실행
```
 ./elasticsearch-plugin install file:'파일경로'/elasticsearch-analysis-seunjeon-5.1.1.1.zip
```

- elasticsearch restart 후 적용됨

- example
```
 curl -XPUT "localhost:9200/?pretty" -d '{
  "settings" : {
    "index":{
      "analysis":{
        "analyzer":{
          "korean":{
            "type":"custom",
            "tokenizer":"seunjeon_default_tokenizer"
          }
        },
        "tokenizer": {
          "seunjeon_default_tokenizer": {
            "type": "seunjeon_tokenizer",
            "index_eojeol": false,
            "user_words": ["낄끼+빠빠,-100", "c\\+\\+", "어그로", "버카충", "abc마트"]
          }
        }
      }
    }
  }
}'

```
