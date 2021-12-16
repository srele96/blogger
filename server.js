require('dotenv').config();
const { pokreniServer } = require('./src/pokreniServer');
const blogRuter = require('./src/rute/blog');
const { ocistiKolacice } = require('./src/middleware/middleware');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

// omoguci citanje podataka iz post requestova
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

// koliko dugo ce korisnik biti ulogovan
// trideset minuta u milisekundama
const TRIDESET_MINUTA = 1800000;

app.use(
  session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: TRIDESET_MINUTA
    }
  })
);

app.use(ocistiKolacice);

// omoguci koriscenje pug templejta
// navedi gde se nalazi direktorijum sa pug fajlovima i view engine
app.set('views', path.join(__dirname, 'src/pogledi'));
app.set('view engine', 'pug');

app.use('/', blogRuter);

// nakon svih zahteva, ako nije uspelo obradjivanje zahteva,
// obavesti korisnika o gresci
app.use('*', (req, res) => {
  if (!res.headersSent) {
    let korisnickoIme = null;
    if (req.session.user) korisnickoIme = req.session.user.korisnickoIme;
    res.status(404).render('404', {
      title: 'Doslo je do greske.',
      korisnickoIme: korisnickoIme
    });
  }
});

pokreniServer(app);
