### Scaling, sharding, performance

* 엘라스틱서치는 기본적으로 5개의 샤드에 나누어서 인덱스를 나누어서 저장함.
* 샤드는 움직일 수 있으나, 기본적으로 엘라스틱서치는 공평하게 나누어지도록 노드에 분배함.
* 노드를 감소시키면, 데이터의 일부분은 사용할 수가 없게됨. 데이터를 더 만들기 위해서, 최초의 샤드(primaries)에 노드를 더 생성하거나, replica(복사본)를 생성할 수 있다.


### Elasticsearch에서의 데이터

* 논리적 구조(Logical layout)
  * Document는 mapping type으로 그룹핑 되어 있고, type 이라고 부른다. 다양한 타입들은 index에 있다.
  * index>type
* 물리적 구조(Physical layout)
  * 엘라스틱서치는 인덱스르 샤드로 분배하는데 이것은 클러스터로 만들어서 통합할 수도 있다.
  * Node > primary(index 포함) , replica(index 포함)

### 클러스트에 노드 추가
* _cluster API 사용
* 지정되지 않은 레플리카의 샤드의 상태는 yellow로 표시됨 : 여기 예제 에서는 2개의 primary shard가 활성화가 되있으나, 노드가 1개이기 때문에, relica들은 할당이 되지 않았음. 즉, primary는 있으나, replica는 없음. primary가 없어지면, 이것은 red가 될 것이다. -> 2개이상의 노드 실행시키도록 한다. (그러면, 상태가 green으로 변함.)

### Elasticsearch 주요 용어 설명

1. Document
   * Elasticsearch는  document 기반임.
   * Document : 검색하기 위한 최소의 단위
   * Elasticsearch 특징
     - Self-contained : document는 fields과 값이 있다.
     - 계층 구조를 가짐 : field의 값은 심플하고, 여러 필드와 값을 가질 수 있음 (예: 주소는 도시와 읍/면리 등 정보를 함께 가짐)
     - 유연한 구조
   * Document는 JSON 형태의 데이터
   * Schema free : 필드의 타입을 지정하지 않아도, 데이터의 타입을 매핑시킴.
   
2. Mapping types (Type)
   * Type은 document들을 담고 있는 논리적인 컨테이너다. (RDB에서 테이블이 row를 담듯이)
   * document의 구조가 다른 컨테이너를 만들기 위해서, mappying type을 사용한다. (예: A라는 그룹이 있는데, 이 그룹은 2가지 타입의 데이터 구조를 사용할때, A-1 type, A-2 type을 만듬)
   * 타입에서의 각각의 필드의 정의를 mapping이라 함.

3. Index
   * 독립적인 document의 덩어리
   * Shard로 index가 나누어짐. (Lucene에서는 shard가 index임) Elasticsearch 인덱스는 여러개의 루씬 인덱스로 구성되어있음.
   * 같은 인덱스를 여러 서버에 분산해서 가질 수 있음
   * 물리적 구조 : node와 shard
   * 기본적으로 각각의 인덱스는 5개의 메인 샤드와 그들의 replica를 가지고 있다. (총 10개) 각각의 샤드는 인덱스로 나누어지고 있다. replica는 신뢰성과 검색 속도를 위해 좋음. shard는 node와 node 사이로 이동하는 가장 작은 단위.
   * 여러 node는 cluster로 조인할 수 있음. : 같은 데이터가 여러개의 서버에 분산될 수 있다. 이것은 엘라스틱서치의 성능을 높이고, 신뢰성을 높인다.
   * 인덱스를 만들기 전에 샤드 갯수 정해야함. 2개의 샤드가 최소이고, 많은 샤드는 퍼포먼스에 영향을 미침. 기본값은 5개
   
### 검색
1. JSON 검색결과
 * took : request에 걸린시간(밀리세컨드)
 * Time_out : time_out 여부, 기본값은 타임아웃 없음
 * _shards :  쿼리된 샤드의 갯수
 * Total, sucessful, failed : document에 매치된 통계값
 * hits : array 형태의 결과
 * Max_score : document와 매칭되는 최대 score
 * Elasticsearch는 결과값 10개로 제한함.(결과값 더 얻기를 원하는 경우 size 파라미터 조정)
 * 결과값 얻기 원하는 필드값 지정하지 않는 경우 _source필드가 나타남.
 * filter 사용
 * Query의 경우 결과값과 해당 score를 제공. score에 관심이 없으면 filter 사용
 
## 설정
 1. elasticsearch.yml
  * 클러스터 이름 지정
    - Cluster.name : snake

 2. logging.yml : 로깅 옵션 지정
   * 리눅스 기반에서 기본 path : /var/log/elasticsearch
   * Main log(cluster-name.log) : 일반적인 로그 (예: query failed)
   * Slow-search log(cluster-name_index_search_slowlog.log) : query가 매우 느릴때 (기본값 : 0.5초 이상)
   * index-slow log (cluster-name_index_indexing_slowlog.log) : 인덱싱할때, 0.5초 이상 걸릴 때
   
 3. elasticsearch.in.sh에 JVM 설정
