const MongoClient = require('mongodb').MongoClient;

const connectionURI = `mongodb+srv://${process.env.MDB_USERNAME}:${process.env.MDB_PASSWORD}@cluster0.856mj.mongodb.net/testdb?retryWrites=true&w=majority`;
const klijent = new MongoClient(connectionURI, { useUnifiedTopology: true });

function MongoDB() {
  this.isConnected = false;
}

MongoDB.prototype.connect = function () {
  klijent.connect((err, client) => {
    if (err) console.log(err);
    else {
      this.mongoBlog = client.db('Blog');
      this.isConnected = true;
    }
  });
};

const DB = new MongoDB();
///////////////////////////////////////////////////////////////////////////////
// this is asynchronous, but not awaited here, it may take some time to connect
// if used before connection is established, it will throw an error
// this case isn't handled anywhere and I don't know if it could be issue
//
// 1. after server is ran for first time, if it's not connected, it will throw
//    an error
// 2. reconnection isnt handled (in case it never connects)
///////////////////////////////////////////////////////////////////////////////
DB.connect();

module.exports.DB = DB;
