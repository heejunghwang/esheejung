# 은전한닢s 사용자 사전 추가

* 참고 : scala 기반이므로, 따로 mecab 설정 필요 없음

  ​


* 예제 목표 : '고프로' 를 검색하자

  ​

1. 색인 삭제

```
DELETE
http://localhost:9200/indexName
```

2. 사용자 사전 생성(csv 형태여야함)

   - /Elasticsearch_HOME/dic/customdic.csv 파일 __(반드시 UTF-8로 인코딩된 파일이어야 함)__
   - 기본 디렉토리는 /Elasticsearch_HOME/config 임
```
고프로,-100
낄끼빠빠
무한도전
```

3. 색인 생성 시 인덱스에서 사용할 Analyzer(은전한닢s) 추가

   (1) 사용자 사전 csv 추가

   - 참고 : csv에서 -100은 사용자 사전 스코어링을 높이기 위해서 넣어줌
   - user_dict_path 에 사용자 사전 csv 파일 넣어줌

```
PUT
http://localhost:9200/indexName
{
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
            "user_dict_path": ["dic/customdic.csv"]
          }
        }
      }
    }
  }
}
```

   (2) csv 추가 없이 설정하는 방법

   - user_words 사용
   - user_words와 user_dict_path 함께 사용할 시에, user_words는 무시되고, user_dict_path 가 사용됨

```
PUT
http://localhost:9200/indexName
{
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
            "user_words": ["낄끼+빠빠,-100", "c\\+\\+", "어그로", "버카충", "abc마트", "고프로"]
          }
        }
      }
    }
  }
}
```



4. Analyzer(은전한닢s) 사용할 field 매핑

```
PUT
http://localhost:9200/indexName/_mapping/typeName
{
    "properties": {
        "fieldName": {
            "type":      "text",
            "analyzer":  "korean",
            "search_analyzer": "korean"
        }
    }
}
```

5. 인덱스 refresh

```
GET
http://localhost:9200/indexName/_refresh
```

6. 테스트 데이터 넣기

```
PUT
http://localhost:9200/indexName/typeName/1
{"fieldName": "고프로를 사고 싶습니다"}
```

7. 결과 확인

```
POST
http://localhost:9200/indexName/_search
{
	"query":{
		"multi_match" : {
			"query" : "고프로",
			"fields" : "fieldName"
		}
	}
}
```

```
{
    "took": 22,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": 0.25316024,
        "hits": [
            {
                "_index": "indexName",
                "_type": "typeName",
                "_id": "1",
                "_score": 0.25316024,
                "_source": {
                    "fieldName": "고프로를 사고 싶습니다"
                }
            }
        ]
    }
}
```

[참고] LexiconDict.scala 파일
~~~scala
  def loadFromIterator(iterator: Iterator[String]): LexiconDict = {
    val startTime = System.nanoTime()
    val terms = new mutable.HashSet[Morpheme]()
  
    iterator.dropWhile(_.head == '#').
      map(_.split(",(?=([^\"]*\"[^\"]*\")*(?![^\"]*\"))").toList.map(_.replaceFirst("^\"", "").replaceFirst("\"$", ""))).
      map(f => f.head.replace(" ", "") :: f.tail).
      foreach { item =>
      try {
        var newTerm:Morpheme = null
        item match {
          // "단어"
          case List(surface) =>
            newTerm = LexiconDict.buildNNGTerm(surface, 1000 - (surface.length * 100))
          // "단어,-100"  # 단어,비용
          case List(surface, cost) =>
            newTerm = LexiconDict.buildNNGTerm(surface, cost.toShort)
          case List(surface, leftId, rightId, cost, feature@_ *) =>
            newTerm = Morpheme(surface,
              leftId.toShort,
              rightId.toShort,
              cost.toShort,
              wrapRefArray(feature.toArray),
              MorphemeType(feature),
              wrapRefArray(Pos.poses(feature)))
        }
        if (terms.contains(newTerm)) {
          logger.warn(s"already has term - $newTerm")
        } else {
          terms += newTerm

        }
      } catch {
        case _: Throwable => logger.warn(s"invalid format : $item")
      }
    }
    val elapsedTime = (System.nanoTime() - startTime) / (1000*1000)
    logger.info(s"csv parsing is completed. ($elapsedTime ms)")

    build(terms.toSeq.sortBy(_.surface))
  }
~~~
