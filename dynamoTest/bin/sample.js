var AWS = require("aws-sdk");
var elasticsearch = require('elasticsearch');
var https = require('https')

/**
 * AWS config 정보
 */
AWS.config = new AWS.Config();
AWS.config.endpoint = "AWS.config.endpoint";
AWS.config.accessKeyId = "AWS.config.accessKeyId";
AWS.config.secretAccessKey = "AWS.config.secretAccessKey";
AWS.config.region = "ap-northeast-2";

/**
 * Elasticsearch 정보
 * @type {elasticsearch.Client}
 */
//TODO : apiVersion 설정정보 추가
//Elasticsearch Connection
var elasticsearchClient = new elasticsearch.Client({
    host: 'localhost:9200',
    keepAlive : false
    // log: 'trace'
});

//Elasticsearch Health check
elasticsearchClient.cluster.health({},function(err,resp,status) {
    console.log("-- Client Health --",resp);
});


/**
 * DynamoDb 접속
 * @type {AWS.DynamoDB.DocumentClient}
 */
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Start the Query");

var params = {
    TableName : "TableName",
    ProjectionExpression : "#did, #met, #ts, #reqUrl, #hmet",
    ExpressionAttributeNames: {
        "#did" : "id",
        "#met": "method",
        "#ts": "timestamp",
        "#reqUrl": "url",
        "#hmet": "handlerMethod",
    },
    httpOptions: {
        agent: new https.Agent({
            secureProtocol: "TLSv1_method",
            ciphers: "ALL"})
    }
};

/**
 * DynamoDb 전체 데이터 조회
 * @param err
 * @param data
 */
docClient.scan(params, onScan);

function onScan(err, data) {
    console.log("onScan")
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Scan succeeded : " + data.Items.length)
        data.Items.forEach(function(result) {

            console.log(result)

            elasticsearchClient.index({
                index: "your_index_name",
                type: "your_type_name",
                body: {
                }
            }, function (err, resp) {
                //elasticsearchClient.close();
                //console.log(err)
                //console.log(resp)
            })


        });

        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            setTimeout(function () {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }, 100000);
        }else{
            console.log("FINISH LOADING")
        }
    }
}
