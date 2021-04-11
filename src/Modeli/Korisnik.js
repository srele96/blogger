/**
 * Korisnik je model koji se koristi za kreiranje novih korisnika u kolekciji
 * 
 * @param {string} korisnickoIme 
 * @param {string} sifra 
 */
function Korisnik(korisnickoIme, sifra) {
  this.korisnickoIme = korisnickoIme;
  this.sifra = sifra;
}

module.exports.Korisnik = Korisnik;