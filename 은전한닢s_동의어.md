

# Elasticsearch  동의어 처리 (은전한닢s)

1. 동음이의의 처리 관련 파일 생성
   * 기본 폴더 : Elasticserach_HOME/config
   * 다음과 같은 파일 생성 (encoding UTF-8로 하는것 잊지 않도록)
   * 예제 파일에서는 synonym.txt 이름으로 생성함.

~~~
소나타, 쏘나타
노트북, labtop, notebook
~~~



2. index에 동의어 처리 세팅
   * analyzer에 filter 처리
   * 예제에서는 test_synonym 이라는 필터 넣어줌
   * test_synonym 필터 설정 시, type 설정 필수(synonym)
   * test_synonym 필터 설정 시, synonyms_path는 동의어 사전 위치
   * test_synonym 필터 설정 시, tokenizer 설정하지 않으면 동의어 처리가 안되므로 설정 필수

~~~
PUT
http://localhost:9200/indexName
{
  "settings" : {
    "index":{
      "analysis":{
           "filter" : {
                "test_synonym" : {
                    "type" : "synonym",
                     "synonyms_path" : "synonym.txt",
                     "tokenizer" :"seunjeon_default_tokenizer"
                }
        },
        "analyzer":{
          "korean":{
            "type":"custom",
            "tokenizer":"seunjeon_default_tokenizer",
            "filter": ["test_synonym","lowercase", "trim"]
          }
        },
        "tokenizer": {
          "seunjeon_default_tokenizer": {
            "type": "seunjeon_tokenizer",
            "index_eojeol": false
          }
        }
      }
    }
  }
}

~~~



3. 결과 확인

* 동의어의 경우, type이 SYNONYM으로 표현되는 것을 확인할 수 있다

~~~
curl -XGET 'localhost:9200/indexName/_analyze?analyzer=korean&pretty=true' -d '노트북'
{
  "tokens" : [
    {
      "token" : "노트/n",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "N",
      "position" : 0
    },
    {
      "token" : "labtop/sl",
      "start_offset" : 0,
      "end_offset" : 3,
      "type" : "SYNONYM",
      "position" : 0,
      "positionLength" : 2
    },
    {
      "token" : "notebook/sl",
      "start_offset" : 0,
      "end_offset" : 3,
      "type" : "SYNONYM",
      "position" : 0,
      "positionLength" : 2
    },
    {
      "token" : "북/n",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "N",
      "position" : 1
    }
  ]
}

~~~

