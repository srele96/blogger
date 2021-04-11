const { mongoKorisnik } = require('../Moduli/MongoKorisnik');
const { Korisnik } = require('../Modeli/Korisnik');
const {
  MIN_KARAKTERA_KORISNICKO_IME_SIFRA,
  MAX_KARAKTERA_KORISNICKO_IME_SIFRA
} = require('../Moduli/konstante');
const { nemaDovoljnoKaraktera } = require('../Moduli/dovoljnoKaraktera');

/**
 * Register kontroler, prikazuje formu za registrovanje korisnika
 * 
 * @param {*} req 
 * @param {*} res 
 */
function register_get(req, res) {
  res.render('register', {
    title: 'Registrujte se',
    minKaraktera: MIN_KARAKTERA_KORISNICKO_IME_SIFRA,
    maxKaraktera: MAX_KARAKTERA_KORISNICKO_IME_SIFRA
  });
}

/**
 * Register kontroler, upravlja logikom registrovanja korisnika
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function register_post(req, res, next) {
  const korisnickoIme = req.body.korisnickoIme;
  const sifra = req.body.sifra;

  // ako korisnicko ime nema dovoljno karaktera, prikazi gresku
  nemaDovoljnoKaraktera(
    korisnickoIme, MIN_KARAKTERA_KORISNICKO_IME_SIFRA, res, 'korisnicko ime', MAX_KARAKTERA_KORISNICKO_IME_SIFRA
  ) // ako sifra nema dovoljno karaktera, prikazi gresku
    .then(() => nemaDovoljnoKaraktera(
      sifra, MIN_KARAKTERA_KORISNICKO_IME_SIFRA, res, 'sifra', MAX_KARAKTERA_KORISNICKO_IME_SIFRA
    ))
    // proveri da li je korisniko ime zauzeto
    .then(() => mongoKorisnik.nadjiKorisnika(korisnickoIme))
    .then(trazenKorisnik => new Promise((resolve, reject) => {
      // korisnicko ime nije zauzeto, napravi korisnika i prosledi ga dalje
      if(trazenKorisnik == null) {
        resolve(new Korisnik(korisnickoIme, sifra));
      }
      // korisnicko ime je zauzeto, prikazi gresku
      else {
        const poruka = 'Korisnicko ime je zauzeto';

        res.render('greska', {
          title: 'Greska',
          poruka: poruka
        });

        reject(poruka);
      }
    }))
    // podaci su ispravni, pokusaj da kreiras korisnika
    .then(mongoKorisnik.kreirajKorisnika)
    .then(kursor => {
      // obavesti korisnika da li je registracija uspela
      if(kursor.insertedCount === 1) {
        // uloguj korisnika
        req.session.user = { korisnickoIme: korisnickoIme };

        // prikazi korisniku poruku
        res.render('poruka', {
          title: 'Uspesno ste se Registrovali',
          poruka: 'Idite na vas profil',
          putanja: `/korisnik/${korisnickoIme}`,
          linkText: `Moj profil ${korisnickoIme}`,
          korisnickoIme: korisnickoIme
        });
      }
      else {
        // nije uspela registracija iz nekog razloga
        res.render('greska', {
          title: 'Greska',
          poruka: 'Doslo je do greske prilikom kreiranja vaseg nalog'
        });
      }
    })
    .catch (err => {
      console.log(err);
      return next();
    })
}

module.exports.register_get = register_get;
module.exports.register_post = register_post;