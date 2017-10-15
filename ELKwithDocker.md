# Setup ELK Stack using Docker Containers



이미지 다운(docer hub 참고)

~~~
docker pull elasticsearch
~~~



* elasticsearch 세팅

~~~
docker run -d -p 9200:9200 -p 9300:9300 -it -h elasticsearch --name elasticsearch elasticsearch
~~~

확인 : curl http://localhost:9200/



* kibana 세팅

~~~
docker run -d  -p 5601:5601 -h kibana --name kibana --link elasticsearch:elasticsearch kibana
~~~



* logstash 세팅

  ~~~
  docker run -h logstash --name logstash --link elasticsearch:elasticsearch -it --rm -v "$PWD":/config-dir logstash -f /config-dir/logstash.conf

  docker run -d -p 9500:9500  -h logstash2 --name logstash2 --link elasticsearch:elasticsearch --rm -v "$PWD":/config-dir logstash -f /config-dir/logstash2.conf
  ~~~

  ​
