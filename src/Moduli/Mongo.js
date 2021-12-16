const { mongoBlog, DB } = require('../mongoBlog');

/**
 * Mongo je bazna klasa za sve ostale jer dele referencu na bazu 'Blog'.
 *
 * @param {string} nazivKolekcije
 */
class Mongo {
  constructor(nazivKolekcije) {
    this.DB = DB;
    // lokalna referenca na bazu
    this.mongoBlog = mongoBlog;
    this.nazivKolekcije = nazivKolekcije;
  }
}

module.exports.Mongo = Mongo;
