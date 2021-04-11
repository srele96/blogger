const { mongoKorisnik } = require('../Moduli/MongoKorisnik');
const { mongoObjava } = require('../Moduli/MongoObjava');
const { korisnikoveObjave } = require('../Moduli/korisnikoveObjave');
const { nemaVrednost } = require('../Moduli/nemaVrednost');

/**
 * Korisnik kontroler, prikazuje podatke o korisniku na stranici
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function korisnik_get(req, res, next) {
  try {
    const korisnickoIme = req.params.korisnickoIme;
    const trazenKorisnik = await mongoKorisnik.nadjiKorisnika(korisnickoIme);
    const sveObjave = await mongoObjava.nadjiSveObjave();

    // koristi se za razlicit prikaz ulogovanom i izlogovanom
    let ulogovanKorisnik = null;
    if(req.session.user) {
      ulogovanKorisnik = req.session.user.korisnickoIme;
    }

    // ako je nadjen korisnik, isfiltriraj koje su njegove objave i prikazi
    if(trazenKorisnik != null) {      
      // dodajem trazenom korisniku .objave zbog prikaza u pug-u
      trazenKorisnik.objave = await korisnikoveObjave(korisnickoIme, sveObjave);

      res.render('korisnik', { 
        title: trazenKorisnik.korisnickoIme, 
        korisnik: trazenKorisnik,
        korisnickoIme: ulogovanKorisnik 
      });
    } else {
      res.render('greska', {
        title: 'Greska',
        poruka: 'Doslo je do greske prilikom pretrage korisnika',
        korisnickoIme: ulogovanKorisnik
      })
    }
  } catch (err) {
    console.log(err);
    return next();
  }
}

/**
 * Korisnici kontroler, prikazuje podatke o korisnicima na stranici
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function korisnici_get(req, res, next) {
  try {
    const sviKorisnici = await mongoKorisnik.nadjiSveKorisnike();
    const sveObjave = await mongoObjava.nadjiSveObjave();
    
    if(!nemaVrednost(sviKorisnici)) {
      let brojKorisnika = sviKorisnici.length;
      let k = null;
      for(let i = 0; i < brojKorisnika; i++) {
        k = sviKorisnici[i];
        k.objave = await korisnikoveObjave(k.korisnickoIme, sveObjave);
      }
    }

    let korisnickoIme = null;
    if(req.session.user) {
      korisnickoIme = req.session.user.korisnickoIme;
    }

    // prosledi sta god je nadjeno, ako nema ni jedne pug ce prikazati poruku
    res.render('korisnici', {
      title: 'Korisnici',
      sviKorisnici: sviKorisnici,
      korisnickoIme: korisnickoIme
    });
  } catch (err) {
    console.log(err);
    return next();
  }
}

module.exports.korisnik_get = korisnik_get;
module.exports.korisnici_get = korisnici_get;