const { Mongo } = require('./Mongo');
const { nemaVrednost } = require('./nemaVrednost');

/**
 * MongoObjava je zaduzen za manipulaciju kolekcijom 'Objave'
 */
class MongoObjava extends Mongo {
  constructor() {
    super('Objave')
  }

  /**
   * Dodaje objavu ako je prosledjen objekat objavu kao argument.
   * @param {*} objava 
   * @returns {Promise} Promise
   */
  kreirajObjavu = objava => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(objava)) reject('Objava nije definisana');
      
      this.mongoBlog.collection(this.nazivKolekcije).insertOne(objava)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Brise objavu ako je prosledjen argument id
   * @param {number} id
   * @returns {Promise} Obrisanu objavu
   */
  obrisiObjavu = id => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(id)) reject('Id nije definisan');

      // obican id mora da bude konvertovan u mongo ObjectId tip
      // da bi radilo
      const queryObjekat = { _id: this.ObjectId(id) };

      this.mongoBlog.collection(this.nazivKolekcije)
        .findOneAndDelete(queryObjekat)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Nalazi objavu sa id prosledjenim kao argument.
   * @param {string} id 
   * @returns {Promise} Promise
   */
  nadjiObjavu = id => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(id)) reject('Id nije definisan');
      
      // obican id mora da bude konvertovan u mongo ObjectId tip
      // da bi radilo
      const queryObjekat = { _id: this.ObjectId(id) };
      
      this.mongoBlog.collection(this.nazivKolekcije).findOne(queryObjekat)
      .then(resolve)
      .catch(reject);
    });
  }
  
  /**
   * Nalazi sve objave - maksimalan broj koji .find() metod omogucava
   * @returns {Promise} Promise
   */
  nadjiSveObjave = () => {
    return new Promise((resolve, reject) => {
      const kursor = this.mongoBlog.collection(this.nazivKolekcije).find({});

      kursor.toArray()
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Nalazi objavu sa datim id i dodaje komentar
   * @param {number} objavaId 
   * @param {Object} komentar
   * @returns {Promise} Promise
   */
  dodajKomentar = (objavaId, komentar) => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(objavaId)) reject('Objava id nije definisan');
      if(nemaVrednost(komentar)) reject('Komentar nije definisan');

      // obican id mora da bude konvertovan u mongo ObjectId tip
      // da bi radilo
      const query = { _id: this.ObjectId(objavaId) };

      const dodajNovKomentar = { $push: { komentari: komentar} }

      this.mongoBlog.collection(this.nazivKolekcije)
        .findOneAndUpdate(query, dodajNovKomentar)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Brise komentar iz objave ako su prosledjeni komentarId i objavaId
   * 
   * @param {*} komentarId 
   * @param {*} objavaId 
   * @returns {Promise} Objavu sa obrisanim komentarom
   */
  obrisiKomentar = (komentarId, objavaId) => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(komentarId)) reject('Komentar id nije definisan');
      if(nemaVrednost(objavaId)) reject('Komentar id nije definisan');

      // obican id mora da bude konvertovan u mongo ObjectId tip
      // da bi radilo
      const query = { _id: this.ObjectId(objavaId) };

      const ukloniKomentar = {
        $pull: { komentari: { id: komentarId } }
      };

      this.mongoBlog.collection(this.nazivKolekcije)
        .findOneAndUpdate(query, ukloniKomentar)
        .then(resolve)
        .catch(reject);
    })
  }

  /**
   * Nalazi komentar koji je napisao korisnik u datoj objavi
   * 
   * @param {*} komentarId 
   * @param {*} objavaId 
   * @param {string} napisaoKorisnik 
   * @returns {Promise} Objavu sa komentarom
   */
  nadjiKomentar = (komentarId, objavaId, napisaoKorisnik) => {
    return new Promise((resolve, reject) => {
      if(nemaVrednost(komentarId)) reject('Komentar id nema vrednost');
      if(nemaVrednost(objavaId)) reject('Objava id nema vrednost');
      if(nemaVrednost(napisaoKorisnik)) reject('Objavio nema vrednost');
      
      const query = {
        _id: this.ObjectId(objavaId),
        "komentari.id": komentarId,
        "komentari.napisaoKorisnik": napisaoKorisnik
      }

      this.mongoBlog.collection(this.nazivKolekcije).findOne(query)
        .then(resolve)
        .catch(reject);
    });
  }
}

// kreiraj objekat klase i exportuj ga da se na svim mestima koristi jedna
// instanca za manipulisanje kolekcijom
// vise od jedne instance nije potrebno 
// jer ne treba svaki objekat da cuva interno stanje

/**
 * Exportuje se jedna instanca objekta klase MongoObjava
 * @exports mongoObjava
 * @constant mongoObjava
 * @type {Object}
 */
const mongoObjava = new MongoObjava();
module.exports.mongoObjava = mongoObjava;