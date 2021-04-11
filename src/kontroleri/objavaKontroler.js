const { mongoObjava } = require('../Moduli/MongoObjava');
const { Objava } = require('../Modeli/Objava');
const { 
  MIN_KARAKTERA_OBJAVA_NASLOV,
  MAX_KARAKTERA_OBJAVA_NASLOV,
  MIN_KARAKTERA_OBJAVA_SADRZAJ,
  MIN_KARAKTERA_KOMENTAR
} = require('../Moduli/konstante');
const { nemaDovoljnoKaraktera } = require('../Moduli/dovoljnoKaraktera');

/**
 * Kreiraj objavu kontroler, prikazuje formu za kreiranje objave
 * 
 * @param {*} req 
 * @param {*} res 
 */
function kreiraj_objavu_get(req, res) {
  let korisnickoIme = null;
  if(req.session.user) {
    korisnickoIme = req.session.user.korisnickoIme;
  }

  res.render('kreiraj_objavu', {
    title: 'Objavite vasu pricu',
    korisnickoIme: korisnickoIme,
    minKarakteraNaslov: MIN_KARAKTERA_OBJAVA_NASLOV,
    maxKarakteraNaslov: MAX_KARAKTERA_OBJAVA_NASLOV,
    minKarakteraSadrzaj: MIN_KARAKTERA_OBJAVA_SADRZAJ
  });
}

/**
 * Kreiraj objavu kontroler, upravlja logikom kreiranja objave
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next ako dodje do greske
 * @returns {function} next ako dodje do greske
 */
function kreiraj_objavu_post(req, res, next) {
  const naslov = req.body.naslov;
  const sadrzaj = req.body.sadrzaj;
  const korisnickoIme = req.session.user.korisnickoIme;

  // ako naslov nema dovoljno karaktera, prikazi gresku
  nemaDovoljnoKaraktera(
    naslov, MIN_KARAKTERA_OBJAVA_NASLOV, res, 'naslov', 
    MAX_KARAKTERA_OBJAVA_NASLOV
  )
    // ako sadrzaj nema dovoljno karaktera, prikazi gresku
    .then(() => nemaDovoljnoKaraktera(
      sadrzaj, MIN_KARAKTERA_OBJAVA_SADRZAJ, res, 'sadrzaj'
    ))
    // uneti podaci su ispravni, kreiraj objavu
    .then(() => mongoObjava.kreirajObjavu(
      new Objava(naslov, sadrzaj, korisnickoIme)
    ))
    .then(kursor => {
      // uspesno je dodata objava
      if(kursor.insertedCount === 1) {
        res.render('poruka', {
          title: 'Uspesno ste kreirali objavu',
          poruka: 'Mozete videti vasu objavu ovde',
          linkText: naslov,
          putanja: `/objava/${kursor.insertedId}`,
          korisnickoIme: korisnickoIme
        });
      } 
      // doslo je do greske prilikom dodavanja objave
      else {
        res.render('greska', {
          title: 'Greska',
          poruka: 'Doslo je do greske, nismo uspeli da objavimo vasu pricu',
          korisnickoIme: korisnickoIme
        });
      }
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

/**
 * Prikazi objavu kontroler, prikazuje podatke o objavi na stranici
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function prikazi_objavu_get(req, res, next) {
  try {
    const idObjave = req.params.id;
    const trazenaObjava = await mongoObjava.nadjiObjavu(idObjave);

    let korisnickoIme = null;
    if(req.session.user) {
      korisnickoIme = req.session.user.korisnickoIme;
    }

    if(trazenaObjava != null) {
      res.render('objava', {
        title: trazenaObjava.naslov,
        objava: trazenaObjava,
        korisnickoIme: korisnickoIme,
        minKarakteraKomentar: MIN_KARAKTERA_KOMENTAR
      });
    } else {
      res.render('greska', {
        title: 'Greska',
        poruka: 'Doslo je do greske, nismo uspeli da nadjemo objavu',
        korisnickoIme: korisnickoIme
      })
    }
  } catch (err) {
    console.log(err);
    return next();
  }
}

/**
 * Prikazi sve objave kontroler, prikazuje podatke o svim objavama na stranici
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
async function prikazi_sve_objave_get(req, res, next) {
  try {
    const sveObjave = await mongoObjava.nadjiSveObjave();
    
    let korisnickoIme = null;
    if(req.session.user) {
      korisnickoIme = req.session.user.korisnickoIme;
    }

    res.render('objave', {
      title: 'Sve Objave', 
      sveObjave: sveObjave,
      korisnickoIme: korisnickoIme
    });
  } catch (err) {
    console.log(err);
    return next();
  }
}

module.exports.kreiraj_objavu_get = kreiraj_objavu_get;
module.exports.kreiraj_objavu_post = kreiraj_objavu_post;
module.exports.prikazi_objavu_get = prikazi_objavu_get;
module.exports.prikazi_sve_objave_get = prikazi_sve_objave_get;