const { trenutniDatum, trenutnoVreme } = require('../Moduli/date');
const { v4: uuidv4 } = require('uuid');

/**
 * Komentar je model koji se koristi za kreiranje novih komentara u objavi
 * 
 * @param {string} napisaoKorisnik 
 * @param {string} sadrzaj 
 */
function Komentar(napisaoKorisnik, sadrzaj) {
  this.id = uuidv4();
  this.napisaoKorisnik = napisaoKorisnik;
  this.sadrzaj = sadrzaj;
  // datum objavljivanja komentara
  this.trenutniDatum = trenutniDatum();
  // vreme objavljivanja komentara
  this.trenutnoVreme = trenutnoVreme();
}

module.exports.Komentar = Komentar;