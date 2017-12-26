# Java에서 Http 프로토콜 형태로 사용시

~~~~ Java
    String jsonStr = "{\n" +
            "      \"query\": {\n" +
            "        \"multi_match\": {\n" +
            "          \"query\": \"비엠더블유\",\n" +
            "          \"fields\": [\n" +
            "            \"제조사명\",\n" +
            "            \"모델명\"\n" +
            "          ]\n" +
            "        }\n" +
            "      }\n}";

    JSONObject params =JSONObject.fromObject(jsonStr);

    URI uri = UriComponentsBuilder.fromHttpUrl("http://localhost:9200"+ "/_search")
            .build().toUri();

    Map result = restTemplate.postForObject(uri, params, Map.class);
~~~