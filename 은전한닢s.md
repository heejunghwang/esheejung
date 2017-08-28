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

- Analyzer 적용 예 (index name : school)
```
 curl -XPUT "localhost:9200/school?pretty" -d '{
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

- Analyzer 확인

예
~~~
curl -XPOST 'localhost:9200/school/_analyze?pretty' -H 'Content-Type: application/json' -d'
{
  "analyzer": "korean",
  "text":     "아버지가방에들어가신다"
}'
~~~

결과
~~~
 "tokens" : [
    {
      "token" : "아버지/N",
      "start_offset" : 0,
      "end_offset" : 3,
      "type" : "N",
      "position" : 0
    },
    {
      "token" : "방/N",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "N",
      "position" : 1
    },
    {
      "token" : "들어가/V",
      "start_offset" : 6,
      "end_offset" : 9,
      "type" : "V",
      "position" : 2
    }
  ]

~~~

예제
1. http://blog.nacyot.com/articles/2015-06-13-eunjeon-with-elasticsearch/
2. http://blog.naver.com/PostView.nhn?blogId=ysulshin&logNo=220929771145

* Mapping 정보 조회
```
http://localhost:9200/school/_mapping/students
```
