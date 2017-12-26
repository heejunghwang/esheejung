# elasticsearch with node.js
- elasticsearch version : 6.0.0

~~~
npm install
~~~

* bin foler 참조

~~~~
- api
    - connection.js : 엘라스틱서치 연결 
    - createIndex.js : 색인 생성
    - deleteIndex.js : 색인 삭제
    - mapping.js : 인덱스 매핑 (Analyzer 설정)
    - search.js : 검색 API 사용 예제
    - importData.js : csv 데이터 import 후 색인
- config
- data
    - car.csv : csv 데이터 예제
    - synonym.txt : 유의어 사전 (단, elasticsearch_home/config 하위에 위치하도록 한다)
~~~~
