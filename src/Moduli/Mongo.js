const { mongoBlog, ObjectId } = require('../mongoBlog');

/**
 * Mongo je bazna klasa za sve ostale jer dele referencu na bazu 'Blog'.
 * 
 * @param {string} nazivKolekcije
 */
class Mongo {
  constructor(nazivKolekcije) {
    // lokalna referenca na bazu
    this.mongoBlog = mongoBlog;
    this.ObjectId = ObjectId;
    this.nazivKolekcije = nazivKolekcije;
  }
}

module.exports.Mongo = Mongo;