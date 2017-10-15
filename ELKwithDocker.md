# Setup ELK Stack using Docker Containers



## 이미지 다운(docer hub 참고)

~~~
docker pull elasticsearch
~~~



## elasticsearch 세팅

~~~
docker run -d -p 9200:9200 -p 9300:9300 -it -h elasticsearch --name elasticsearch elasticsearch
~~~

확인 : curl http://localhost:9200/

* check config file in elasticsearch
~~~

➜  ~ docker run -d -p 9200:9200 -p 9300:9300 -it -h elasticsearch --name elasticsearch elasticsearch
626a04677599fff4fe8b0f5efa05bf83fe6fdea9d855b4d1856c77914105facd
➜  ~ docker exec -ti elasticsearch /bin/sh
# ls
NOTICE.txt  README.textile  bin  config  data  lib  logs  modules  plugins
# cd config
# ls
elasticsearch.yml  log4j2.properties  scripts
# vi elasticsearch.yml
/bin/sh: 4: vi: not found
# cat elasticsearch.yml
http.host: 0.0.0.0

# Uncomment the following lines for a production cluster deployment
#transport.host: 0.0.0.0
#discovery.zen.minimum_master_nodes: 1
#
~~~


## kibana 세팅

~~~
docker run -d  -p 5601:5601 -h kibana --name kibana --link elasticsearch:elasticsearch kibana
~~~



## logstash 세팅

  ~~~
  docker run -h logstash --name logstash --link elasticsearch:elasticsearch -it --rm -v "$PWD":/config-dir logstash -f /config-dir/logstash.conf

  docker run -d -p 9500:9500  -h logstash2 --name logstash2 --link elasticsearch:elasticsearch --rm -v "$PWD":/config-dir logstash -f /config-dir/logstash2.conf
  ~~~

  ​
