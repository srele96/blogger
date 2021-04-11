const express = require('express');
const router = express.Router();

const { jesteUlogovan, nijeUlogovan } = require('../middleware/restrikcije');

// ----------------------------------------------------------------------------
// KONTROLERI UPRAVLJAJU LOGIKOM RUTA
// ----------------------------------------------------------------------------

const { index_get } = require('../kontroleri/indexKontroler');
const { logout_post  } = require('../kontroleri/logoutKontroler');
const { login_get, login_post } = require('../kontroleri/loginKontroler');
const { dodaj_komentar_post } = require('../kontroleri/komentarKontroler');

const {
  obrisi_komentar_post, obrisi_korisnika_post, obrisi_objavu_post
} = require('../kontroleri/obrisiKontroler');

const {
  kreiraj_objavu_get, kreiraj_objavu_post,
  prikazi_objavu_get, prikazi_sve_objave_get
} = require('../kontroleri/objavaKontroler');

const {
  register_get, register_post 
} = require('../kontroleri/registerKontroler');

const {
  korisnik_get, korisnici_get
} = require('../kontroleri/korisnikKontroler');

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// RUTE SA RESTRIKCIJAMA

// SAMO ZA ULOGOVANE KORISNIKE!!!
// Korisnik moze da pokusa da se: 
//   * izloguje
//   * komentarise
//   * prikaze stranicu za kreiranje nove objave 
//   * napravi novu objavu 
// SAMO AKO JE ULOGOVAN!!!

// logout
router.post('/logout', jesteUlogovan, logout_post);
// objave
router.get('/objava/kreiraj', jesteUlogovan, kreiraj_objavu_get);
router.post('/objava/kreiraj', jesteUlogovan, kreiraj_objavu_post);
// komentar
router.post('/komentar', jesteUlogovan, dodaj_komentar_post);
// brisanje
router.post('/obrisi/komentar', jesteUlogovan, obrisi_komentar_post);
router.post('/obrisi/korisnika', jesteUlogovan, obrisi_korisnika_post);
router.post('/obrisi/objavu', jesteUlogovan, obrisi_objavu_post);

// SAMO ZA IZLOGOVANE KORISNIKE!!!
// Korisnik moze da pokusa da se:
//   * uloguje
//   * registruje 
// SAMO AKO NIJE ULOGOVAN!!!

// login
router.get('/login', nijeUlogovan, login_get);
router.post('/login', nijeUlogovan, login_post);
// register
router.get('/register', nijeUlogovan, register_get);
router.post('/register', nijeUlogovan, register_post);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// RUTE BEZ RESTRIKCIJA

// index
router.get('/', index_get);
// objava/objave
router.get('/objava/:id', prikazi_objavu_get);
router.get('/objave', prikazi_sve_objave_get);
// koricnik/korisnici
router.get('/korisnik/:korisnickoIme', korisnik_get);
router.get('/korisnici', korisnici_get);

module.exports = router;