const { Mongo } = require('./Mongo');
const { nemaVrednost } = require('./nemaVrednost');

/**
 * MongoKorisnik je zaduzen za manipulaciju kolekcijom 'Korisnici'
 */
class MongoKorisnik extends Mongo {
  constructor() {
    super('Korisnici');
  }

  /**
   * Dodaje korisnika ako je prosledjen objekat korisnik kao argument.
   * @param {Object} korisnik
   * @returns {Promise} Promise
   */
  kreirajKorisnika = (korisnik) => {
    return new Promise((resolve, reject) => {
      // da li je prosledjen parametar
      if (nemaVrednost(korisnik)) {
        reject('Korisnik nije definisan');
      }

      this.DB.mongoBlog
        .collection(this.nazivKolekcije)
        .insertOne(korisnik)
        .then((kursor) => resolve(kursor))
        .catch((err) => reject(err));
    });
  };

  /**
   * Brise korisnika ako je prosledjeno korisnicko ime kao argument
   *
   * @param {string} korisnickoIme
   * @returns {Promise} Obrisanog korisnika
   */
  obrisiKorisnika = (korisnickoIme) => {
    return new Promise((resolve, reject) => {
      if (nemaVrednost(korisnickoIme)) reject('Korisnicko ime nije definisano');

      const queryObjekat = {
        korisnickoIme: korisnickoIme
      };

      this.DB.mongoBlog
        .collection(this.nazivKolekcije)
        .findOneAndDelete(queryObjekat)
        .then(resolve)
        .catch(reject);
    });
  };

  /**
   * Nalazi korisnika ako je prosledjeno korisnickoIme kao argument.
   * @param {string} korisnickoIme
   * @returns {Promise} Promise
   */
  nadjiKorisnika = (korisnickoIme) => {
    return new Promise((resolve, reject) => {
      // da li je prosledjen parametar
      if (nemaVrednost(korisnickoIme)) reject('Korisnik nije definisan');

      const queryObjekat = {
        korisnickoIme: korisnickoIme
      };

      this.DB.mongoBlog
        .collection(this.nazivKolekcije)
        .findOne(queryObjekat)
        .then((korisnik) => resolve(korisnik))
        .catch((err) => reject(err));
    });
  };

  /**
   * Nalazi sve korisnike - maksimalan broj koji .find() metod omogucava
   * @returns {Promise} Promise
   */
  nadjiSveKorisnike = () => {
    return new Promise((resolve, reject) => {
      const kursor = this.DB.mongoBlog.collection(this.nazivKolekcije).find({});

      kursor
        .toArray()
        .then((korisnici) => resolve(korisnici))
        .catch((err) => reject(err));
    });
  };
}

// kreiraj objekat klase i exportuj ga da se na svim mestima koristi jedna
// instanca za manipulisanje kolekcijom
// vise od jedne instance nije potrebno
// jer ne treba svaki objekat da cuva interno stanje

/**
 * Exportuje se jedna instanca objekta klase MongoKorisnik
 * @exports mongoKorisnik
 * @constant mongoKorisnik
 * @type {Object}
 */
const mongoKorisnik = new MongoKorisnik();
module.exports.mongoKorisnik = mongoKorisnik;
