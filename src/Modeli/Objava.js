const { trenutniDatum, trenutnoVreme } = require('../Moduli/date');

/**
 * Objava je model koji se koristi za kreiranje novih objava u kolekciji
 * 
 * @param {string} naslov 
 * @param {string} sadrzaj 
 * @param {string} objavio 
 */
function Objava(naslov, sadrzaj, objavio) {
  this.naslov = naslov;
  this.sadrzaj = sadrzaj;
  this.objavio = objavio;
  // datum objavljivanja posta
  this.datum = trenutniDatum();
  // vreme objavljivanja posta
  this.vreme = trenutnoVreme();
  this.komentari = [];
}

module.exports.Objava = Objava;