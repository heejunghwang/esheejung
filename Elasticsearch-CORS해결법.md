# Elasticsearch - CORS 해결법

## 엘라스틱 서치 사용시, CORS 관련 처리법

* 오류 메시지
~~~
No 'Access-Control-Allow-Origin' header is present on the requested resource ~~~
~~~

* elasticsearch.yml 파일에서 아래 추가해주도록 한다.
~~~
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers: "X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization"
~~~

* (참고) CORS는 서버측과 호출하는 쪽 양쪽을 확인을 해봐야한다.
