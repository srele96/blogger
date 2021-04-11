const { nemaVrednost } = require('./nemaVrednost');

/**
 * Vraca korisnikove objave
 * 
 * @param {string} korisnickoIme 
 * @param {Array} objave 
 * @returns {Promise} Objave
 */
function korisnikoveObjave(korisnickoIme, objave) {
  return new Promise((resolve, reject) => {
    if(nemaVrednost(korisnickoIme)) reject('KorisnickoIme nije definisano');
    if(nemaVrednost(objave)) reject('Objave nisu definisani');

    // prosledjene objave filtrira, izdvaja samo one koje je korisnik napisao
    function reducer (accumulator, current) {
      // ako je objava koju je korisnik objavio, dodaj ga u akumulator
      // ako nije, vrati samo akumulator
      return current.objavio === korisnickoIme ?
        [...accumulator, current] : accumulator;
    }

    // objave koje je korisnik objavio
    resolve(objave.reduce(reducer, []));
  });
}

module.exports.korisnikoveObjave = korisnikoveObjave;