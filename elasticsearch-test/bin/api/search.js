let elasticsearchClient = require('./connection.js');

elasticsearchClient.search({
    body: {
        query: {
            multi_match : {
                query: "420i Coupe M Sports",
                fields: ["제조사명", "모델명"]
            }
        },
    }
},function (error, response,status) {
    if (error){
        console.log("search error: "+error)
    }
    else {
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        response.hits.hits.forEach(function(hit){
            console.log(hit);
        })
    }
});