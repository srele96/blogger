const { mongoObjava } = require('../Moduli/MongoObjava');
const { Komentar } = require('../Modeli/Komentar');
const { MIN_KARAKTERA_KOMENTAR } = require('../Moduli/konstante');
const { komentarNemaDovoljnoKaraktera } = require('../Moduli/dovoljnoKaraktera');

/**
 * Komentar kontroler koji dodaje komentar na objavu
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function dodaj_komentar_post(req, res, next) {
  const postId = req.body.postId;
  const sadrzaj = req.body.sadrzaj;

  // koristi se za razlicit prikaz ulogovan i izlogovanom korisniku
  let korisnickoIme = null;
  if(req.session.user) korisnickoIme = req.session.user.korisnickoIme;

  // da li sadrzaj komentara ima dovoljno karaktera
  komentarNemaDovoljnoKaraktera(
    sadrzaj, MIN_KARAKTERA_KOMENTAR, res, 'komentar', postId, korisnickoIme
  )
    // sadrzaj komentara ima dovoljno karaktera, pokusaj da dodas komentar
    .then(() => mongoObjava.dodajKomentar(postId, new Komentar(
      korisnickoIme, sadrzaj
    )))
    .then(kursor => {
      // uspesno je dodat komentar
      if(kursor.lastErrorObject.updatedExisting) {
        res.render('poruka', {
          title: 'Uspesno ste objavili komentar',
          putanja: `/objava/${postId}`,
          linkText: 'Pogledajte vas komentar',
          korisnickoIme: korisnickoIme
        });
      }
      // doslo je do greske prilikom dodavanja komentara
      else {
        res.render('poruka', {
          title: 'Greska',
          poruka: 'Dodavanje vaseg komentara nije uspelo',
          putanja: `/objava/${postId}`,
          linkText: 'Vrati me na objavu',
          korisnickoIme: korisnickoIme
        });
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

module.exports.dodaj_komentar_post = dodaj_komentar_post;
