* Elasticsearch Recommendation
  * 50% 메모리 -> 힙메모리
  * 나머지 50% -> OS disk cache(루씬에 사용)
  * 32G이상 사용하지 말 것
    * 32G 이상 사용하면 GC 시간이 길어짐
    * Node가 Cluster에서 remove 되는 현상
* Feild Data Cache 사용 최소화 (1.X)
  * Elasticsearch는 Index 내 모든 Value를 Field Data cache로 로딩함.
  * Size 설정(1G)
  * Feild 에 Doc Value 설정
    * Feild를 사용하면, Field Data 캐시 미사용으로 Heap Memory 사용량 줄일 수 있음
  * Elasticsearch 2.x는 Doc value가 기본값.
* Index 생성은 상당히 비용이 소요되는 작업임.
  * Time base로 index 생성하는 경우, 미리 index 만들어두는 스크립트 배치 사용하는 것이 좋음.
* Master, Data node 분리하면, Cluster가 안정화 될 수 있음
* 운영가이드
  * fd count &. Bootstrap.mlockall 체크
    * fd count : 파일 디스크립터 카운트를 많이 쓰기 때문에 충분한 값을 설정 필요
    * Bootstrap.mlockall : true설정 필요. 힙메모리 할당 후, 메모리를 locking해서 스와핑이 되지 않도록 설정
  * 처리 데이터량이 증가할 때
    * Master, Data, Query Node 분리
    * Feild Data Cache Size 설정 필요
    * Query 기간 제한
  * Scale-out
