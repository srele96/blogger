const { mongoKorisnik } = require('../Moduli/MongoKorisnik');
const {
  MIN_KARAKTERA_KORISNICKO_IME_SIFRA,
  MAX_KARAKTERA_KORISNICKO_IME_SIFRA
} = require('../Moduli/konstante');
const { nemaDovoljnoKaraktera } = require('../Moduli/dovoljnoKaraktera');

/**
 * Login kontroler, prikazuje login formu na stranici
 * 
 * @param {*} req 
 * @param {*} res 
 */
function login_get(req, res) {
  res.render('login', { 
    title: 'Ulogujte se',
    minKaraktera: MIN_KARAKTERA_KORISNICKO_IME_SIFRA,
    maxKaraktera: MAX_KARAKTERA_KORISNICKO_IME_SIFRA
  });
}

/**
 * Login kontroler, upravlja logikom za login korisnika
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function login_post(req, res, next) {
  const korisnickoIme = req.body.korisnickoIme;
  const sifra = req.body.sifra;

  // ako korisnicko ime nema dovoljno karaktera, prikazi gresku
  nemaDovoljnoKaraktera(
    korisnickoIme, MIN_KARAKTERA_KORISNICKO_IME_SIFRA, res,
    'korisnicko ime', MAX_KARAKTERA_KORISNICKO_IME_SIFRA
  ) // ako sifra nema dovoljno karaktera, prikazi gresku
    .then(() => nemaDovoljnoKaraktera(
      sifra, MIN_KARAKTERA_KORISNICKO_IME_SIFRA, res,
      'sifra', MAX_KARAKTERA_KORISNICKO_IME_SIFRA
    ))
    // nadji korisnika
    .then(() => mongoKorisnik.nadjiKorisnika(korisnickoIme))
    .then(trazenKorisnik => {
      // nije nadjen korisnik
      if(trazenKorisnik == null) {
        // prikazi korisniku gresku
        res.render('greska', {
          title: 'Greska',
          poruka: 'Korisnicko ime ili sifra nisu ispravni'
        });
      } 
      // sifra nije dobra
      else if(trazenKorisnik.sifra !== sifra) {
        // prikazi korisniku gresku
        res.render('greska', {
          title: 'Greska',
          poruka: 'Korisnicko ime ili sifra nisu ispravni'
        });
      } 
      // uneti podaci su ispravni, uloguj korisnika
      else {
        // uloguj korisnika
        req.session.user = { korisnickoIme: korisnickoIme };

        // prikazi korisniku poruku
        res.render('poruka', {
          title: `Uspesno ste se ulogovali ${korisnickoIme}`,
          putanja: `/korisnik/${korisnickoIme}`,
          linkText: `Moj profil ${korisnickoIme}`,
          korisnickoIme: korisnickoIme
        });
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

module.exports.login_get = login_get;
module.exports.login_post = login_post;