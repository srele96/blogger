/**
 * Ovaj middleware proverava da li su kolacici za sesiju sacuvani u browseru, 
 * a korisnik ne postoji u sesiji na serveru.
 * 
 * Ovo se obicno desava kada se ugasi express server, 
 * a korisnik ostane ulogovan u pretrazivacu.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function ocistiKolacice(req, res, next) {
  // ostali su kolacici, korisnika nema u sesiji
  if (req.cookies.user_sid && !req.session.user) {
    // izloguj korisnika iz browsera
    res.clearCookie('user_sid');
  }

  next();
}

module.exports.ocistiKolacice = ocistiKolacice;