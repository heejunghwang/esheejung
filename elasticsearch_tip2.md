# Elasticsearch Do's, Don'ts and Pro-Tips

## 클러스터를 보호

* **public IP 바인드 하지 말것!**
* 선호하는 서브넷(AWS VPC)에서 Private IP/DNS 만 사용할것
  * elasticsearch.yml 내에서 Network.host
* ES에 대한 클리이언트에 모든 요청은 Proxy할 것
  * ES 클라이언트와 public으로 접근은 하지 말도록 하고, ES 클라이언트와 직접 접근할 수 있는 커스텀한 API 따로 구현할것. (Elasticsearch에서 DSL 사용하지 말것.)
* HTTP가 필요 없을때는 비활성화 할것
  * 기본 포트 사용하지 말것.
* 사용할 수 있는 클라이언트 노드를 보호할것.
  * VPN으로 통해서만 접근할 수 있도록
  * 최소한 SSL + 승인절차(VPN이 아니라면)
* Dynamic scripting은 막을 것 (5.0 이전)



## 설계

1. 거대한 인덱스 (A monolith Index)

* 예)

  * 검색시 검색 상단에 표시
  * 레코드 링크
  * 이상징후 탐색
  
* 참조링크:[http://code972.com/blog/2016/11/102-all-you-need-to-know-about-elasticsearch-5-0-index-management]

* 변덕스러울 경우에는?

  * mapping이나 설계를 바꿀 수 있도록 해야함.
  * 회복 가능하능한 상태로 만들어야함.
  * 백업과 복원이 효율적이고 신뢰성있음. (5~10분 단위로)
  * API 재색인

* Elasticsearch 5.0의 경우

  * Shrink API
  * Rollover API
  * Cache management
  * query optimization

* Document oriented design(도큐먼트 지향 설계)

  * 아래 예시 문제점 :  product 컬럼이 엄청나게 커짐, 하나의 상품은 하나의 카테고리밖에 가질 수 없으므로, 같은 데이터가 중복이 될 수 있는 문제점이 있음.

    ~~~
    //catogories/my-category
    {  
      title : "my category"
      products : {
      	{
      		"name" : "a",
      		"price" : 1
      	},{
      		"name" : "b",
      		"price" : 2
    		}
    }
    ~~~

    

  * 이렇게 하면..? 어떤게 "a"의 가격인지 알 수 없음.(1,2인지 알 수 없음)

    ~~~
    //catogories/my-category
    {  
      title : "my category"
      products.name : {	
      		"a",
      		"b"
      },
      products.price : [1,2]

    }
    ~~~

  * Parent-child : 조인형태로 사용은 할 수 있으나 쿼리타임에 하도록 책임을 주는 형태 (검색엔진에서는 색인시에 하도록 하는것을 선호)

    ~~~
    //products/114?parent=my-category
    {
      "name" : "a",
      "price" : 1
    }


    //products/123?parent=my-category
    {
      "name" : "b",
      "price" : 2
    }
    ~~~

  * 메타 데이터를 자식에 포함하는 형태

    ~~~
    //products/114
    {
      "name" : "a",
      "price" : 1,
      "category" : {
        	"title" : "my category"
      }
    }
    //products/823
    {
      "name" : "b",
      "price" : 2,
        "category" : {
        	"title" : "my category"
      }
    }
    ~~~

  * Document 지향적 설계는?

   * flat docs
   * 관계를 맺지 않도록 노력
    * parent-child 형태 피하고, 중첩된 도큐먼트 피하도록
    * 대부분의 케이스는 flat docs나 정규화, 전처리나 집계과정에서 해결할 수 있음.
   * 관계를 느슨하도록 하도록 할 것.
    * 업데이트는 자주 일어나지 않으므로, 스크립트나 외부 tool로 하는 것이 쉬우므로, 관계를 느슨하게 해도 된다.
   * 도큐먼트의 키는 정적(static)이어야 하며, 사용자나 자동으로 생성되지 않도록
   * 100개의 프로터티 이상의 도큐먼트를 가지도록 하는 것은 피하도록

  * Query 지향적 설계는?

   * 인덱스와 도큐먼트 구조를 접근할 때 가장 쉬운 방법을 생각해본다. 예) 내가 추출하고 싶은 데이터는 어떻게 표현하고 싶은가?
   * 도큐먼트를 평평하게 하고, 계획된 쿼리나 집계에 맞춰서 설계
   * 엘라스틱 인덱스는 유연함

    

2. 시간 기반의 이벤트 인덱스 (Rolling indexes)

* 예)
  * 중앙집중화된 로깅
  * 감사 데이터(Auditing)
  * IoT
* 시간별로 인덱스 만들도록
* 참조링크:[http://code972.com/blog/2016/11/102-all-you-need-to-know-about-elasticsearch-5-0-index-management]



## Query

1. Query latency (쿼리 속도)

* Elasticsearch는 두개의 스코어링 모델을 사용
  * The Boolean : 쿼리에 맞는 도큐먼트가 있는지 없는지
  * The Vector Space Models : 스코어나 관련성 판단 (어떤 쿼리를 하느냐에 따라서 비용이 많을수도 있음)
* Index lookups 가 많음
* Scoring



2. All queries are Term and Bool



3. Disgn for efficient queries
   * 색인시에 처리하는게 쿼리시에 계산하는것 보다 낫다
   * term의 작은 부분도 가능
   * 정적인 내용이나, 풀텍스트가 아닌 term 쿼리에는 filter를 사용하도록 한다. (filter 사용하면 캐싱 가능)
   * Script (fields, score)는 검색을 느리게 함.



4. Deep paging
   * From-size 사용하지 말것 (불안정함)
   * _after로 검색할것 (elasticsearch 5.0 신규 기능)
   * Scroll, sliced-scroll (elasticsearch 5.0 신규 기능)



5. NGRams 를 검색에 사용하지 말것.

   * 검색어 suggestion이 필요할때는?
    * Suggesters 사용할것
    * Fuzzy search
   * "WiFi", "WS400"(카메라 모델?) 같은것이 필요할땐?
    * Elastic's Word Delimiter 토큰 필터 사용

   

6. Query explanation 하려면?

   * _explain API 사용
   * 검색 요청시에 Explain: true 사용하도록 한다.



7. Query profile

   * 쿼리 디버깅 할 때 좋음

   

8. Named queries



## Mappings

* index template 사용
  * 명시적으로 매핑하도록 한다.
* _all 필드는 사용하지 않도록 한다.
  * Copy_ 를 대신 사용하도록 한다.



## Types

타입이 진짜 필요한가요???

* 타입은 매핑을 분류할 뿐이다(논리적으로)
* 인덱스가 더 관리하기 편한 단위임.



## Cluster 관리

* Key/value 저장이나 캐시로 쓰지 말것.

  * 다시 샤딩할 수 없음

  * 많은 쓰기는 머지를 일으킴

  * 업데이트와 삭제는 두배의 작업임

    

* Re-balancing 는 하지 말것

  * lock down
  * 샤드 할당은 API 사용하지 말고, 최후의 수단으로 쓸 것



* 최적의 샤드 사이즈(Optimal shard size)
  * 검색 속도를 위해서 몇 100만단위의 도큐먼트 사이즈
  * 시작 시간과 네트워크 할당을 위해서는 5~8GB가 최대



* 디버깅 툴
  * Cluster allocation explanation
  * Explain API
  * improved profile API
  * logstash monitoring API


* Kopf 사용하면 편하게 노드 관리할 수 있음(cerebro 쓰지 말것)



*  Cluster topology
  * Master-eligible nodes : 3개
  * Data nodes : sizing per data
  * Client nodes : scalable, sizing per traffic



* Geographic distribution

  * 같은 클러스터에 하지 말것

  * Tribe Node 찾아볼 것

  * 어떤 경우에 적절할 수 있음


* Ingest Nodes

  * 파이프라인에서 정의함.

  * 프로세서에서 사용 가능 : grok, lowercase, split, convert 등

   

* Ingestion 아키텍쳐

  * 외부에서 가져올때 좋음
  * long-tailing 해야하는 logstash보다 FileBeat 사용 고려해보기
  * ingest nodes를 위해 logstash 사용
  * 밀려드는 것을 방지 하기 위해 Kafka, Redis 와 같은 큐 사용 고려 



link : https://www.youtube.com/watch?v=c9O5_a50aOQ



