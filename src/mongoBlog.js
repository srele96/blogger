const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// string za konekciju sa lokalnom mongo robo 3t bazom
const mongodb = 'mongodb://localhost:27017';

// povezi sa mongo robo 3t bazom
const klijent = new MongoClient(mongodb, { useUnifiedTopology: true });
klijent.connect();

/**
 * Referenca na mongo bazu 'Blog'
 * @constant mongoBlog
 */
const mongoBlog = klijent.db('Blog');

// svaki import ce koristiti referencu na bazu Blog
module.exports.mongoBlog = mongoBlog;
module.exports.ObjectId = ObjectId;