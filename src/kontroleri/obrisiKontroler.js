const { mongoKorisnik } = require('../Moduli/MongoKorisnik');
const { mongoObjava } = require('../Moduli/MongoObjava');
const { nemaVrednost } = require('../Moduli/nemaVrednost');

/**
 * Obrisi komentar kontroler, upravlja logikom brisanja komentara
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
function obrisi_komentar_post(req, res, next) {
  const komentarId = req.body.komentarId;
  const objavaId = req.body.objavaId;
  let korisnickoIme = null;

  if(req.session.user) korisnickoIme = req.session.user.korisnickoIme;

  // proveri da li je zahtevan komentar za brisanje na objavi
  // objavio ulogovan korisnik
  mongoObjava.nadjiKomentar(komentarId, objavaId, korisnickoIme)
    .then(objava => new Promise((resolve, reject) => {
      // korisnik ne treba da zna zasto nije izvrseno brisanje
      // id objave i komentara moze korisnik da posalje sam van sajta
      // preko zahteva, da pokusa obrisati komentar koji nije njegov
      if(nemaVrednost(objava)) {
        return next();
      } else {
        mongoObjava.obrisiKomentar(komentarId, objavaId)
          .then(resolve)
          .catch(reject);
      }
    }))
    .then(obrisanaObjava => {
      if(nemaVrednost(obrisanaObjava)) {
        const poruka = 'Nismo uspeli da obrisemo trazen komentar.'

        res.render('poruka', {
          title: 'Greska',
          poruka: poruka,
          putanja: `/objava/${objavaId}`,
          linkText: 'Vrati me na objavu'
        });
      }  else {
        res.render('poruka', {
          title: 'Uspesno smo obrisali vas komentar',
          putanja: `/objava/${objavaId}`,
          linkText: 'Vrati me na objavu'
        });
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    })
}

/**
 * Obrisi korisnika kontroler, upravlja logikom brisanja korisnika
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
function obrisi_korisnika_post(req, res, next) {
  const korisnikZaBrisanje = req.body.korisnickoIme;
  let korisnickoIme = null;
  if(req.session.user) korisnickoIme = req.session.user.korisnickoIme;

  // nadji korisnika za brisanje
  mongoKorisnik.nadjiKorisnika(korisnikZaBrisanje)
    .then(korisnik => new Promise((resolve, reject) => {
      // nije nadjen korisnik
      if(nemaVrednost(korisnik)) {
        return next();
      }
      // zahtevan korisnik za brisanje nije ulogovan korisnik 
      else if(korisnik.korisnickoIme !== korisnickoIme) {
        return next();
      } else {
        // obrisi moj account
        mongoKorisnik.obrisiKorisnika(korisnickoIme)
          .then(resolve)
          .catch(reject);
      }
    }))
    .then(obrisanKorisnik => {
      if(nemaVrednost(obrisanKorisnik)) {
        // izloguj korisnika za svaki slucaj
        req.session.destroy();

        res.render('poruka', {
          title: 'Doslo je do greske, izlogovani ste',
          poruka: 'Nismo uspeli da obriseno vas nalog',
          linkText: 'Log in',
          putanja: `/login`
        });
      } else {
        // izloguj korisnika
        req.session.destroy();

        res.render('poruka', {
          title: 'Uspesno ste obrisali nalog',
          linkText: 'Pocetna stranica',
          putanja: '/'
        });
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

/**
 * Obrisi objavu kontroler, upravlja logikom brisanja objave
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
function obrisi_objavu_post(req, res, next) {
  const objavaId = req.body.objavaId;
  let korisnickoIme = null;
  if(req.session.user) korisnickoIme = req.session.user.korisnickoIme;

  mongoObjava.nadjiObjavu(objavaId)
    .then(objava => new Promise((resolve, reject) => {
      // regularni korisnici nemaju opciju na sajtu da posalju zahtev
      // da obrisu tudju objavu ili objavu sa njihovim unetim id

      // korisnici koji imaju tehnicko znanje mogu da posalju ovaj request
      // ako objava nije nadjena (prosledjen je custom id)

      // ako je objava nadjena, samo korisnik koji je napisao moze da je brise

      // oba zahteva zahtevaju tehnicko znanje pa se odbija zahtev bez detalja
      // o gresci koja je nastala, prikazuje da zahtev nije ispunjen
      if(nemaVrednost(objava)) {
        return next();
      } else if (objava.objavio !== korisnickoIme) {
        return next();
      } else {
        // objava postoji i korisniku je dozvoljeno brisanje
        mongoObjava.obrisiObjavu(objavaId).then(resolve).catch(reject);
      }
    }))
    .then(obrisanaObjava => {
      if(nemaVrednost(obrisanaObjava)) {
        const poruka = 'Nismo uspeli da obrisemo trazenu objavu';

        res.render('poruka', {
          title: 'Greska',
          poruka: poruka,
          putanja: `/objava/${objavaId}`,
          linkText: 'Vrati me na objavu'
        });
      } else {
        const poruka = 'Uspesno ste obrisali objavu: ' + 
          `${obrisanaObjava.value.naslov}`;

        res.render('poruka', {
          title: poruka,
          putanja: `/korisnik/${korisnickoIme}`,
          linkText: 'Vrati me na profil'
        })
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

module.exports.obrisi_komentar_post = obrisi_komentar_post;
module.exports.obrisi_korisnika_post = obrisi_korisnika_post;
module.exports.obrisi_objavu_post = obrisi_objavu_post;