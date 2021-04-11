const { nemaVrednost } = require('../Moduli/nemaVrednost');

/**
 * Proverava da li je korisnik ulogovan da bi nastavio izvrsavanje
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function jesteUlogovan(req, res, next) {
  if(!nemaVrednost(req.session.user)) {
    next();
  } else {
    res.render('poruka', {
      title: 'Nemate pristup ovoj funkciji',
      putanja: '/login',
      linkText: 'Ulogujte se'
    });
  }
}

/**
 * Proverava da li korisnik nije ulogovan da bi nastavio izvrsavanje
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function nijeUlogovan(req, res, next) {
  if(nemaVrednost(req.session.user)) {
    next();
  } else {
    res.render('poruka', {
      title: 'Vec ste ulogovani',
      linkText: `Moj profil ${req.session.user.korisnickoIme}`,
      putanja: `/korisnik/${req.session.user.korisnickoIme}`,
      korisnickoIme: req.session.user.korisnickoIme
    })
  }
}

module.exports.jesteUlogovan = jesteUlogovan;
module.exports.nijeUlogovan = nijeUlogovan;