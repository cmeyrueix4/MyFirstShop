const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://store-manager:manaGEME173@cluster0-shard-00-00.zurim.mongodb.net:27017,cluster0-shard-00-01.zurim.mongodb.net:27017,cluster0-shard-00-02.zurim.mongodb.net:27017/test?ssl=true&replicaSet=atlas-96hs71-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(client => {
        console.log("Connected");
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
};

const getDb = () => {
    if(_db){
        return _db;
    }

    throw "No database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;