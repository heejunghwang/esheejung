let csvToJson = require('convert-csv-to-json');
let elasticsearchClient = require('./connection.js');

/**
 * csv로부터 데이터 가져옴
 * @type {Array}
 */

let json = csvToJson.getJsonFromCsv("../data/car.csv");
for(let i=0; i<json.length;i++){
    console.log(json[i]);
    var elData = json[i];
    indexData('car', elData);
}


/**
 * 엘라스틱서치 색인
 * @param indexName
 * @param elData
 */
function indexData(indexName, elData) {
    elasticsearchClient.index({
        index: indexName,
        type: 'car',
        //id: '1',
        body: elData
    }, function (error, response) {
        console.log(error)
    });
}



