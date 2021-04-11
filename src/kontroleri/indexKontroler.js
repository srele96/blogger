/**
 * Ruta kontroler koji prikazuje pocetnu stranicu
 * @param {*} req 
 * @param {*} res 
 */
function index_get(req, res) {
  let korisnickoIme = null;
  
  if(req.session.user) {
    korisnickoIme = req.session.user.korisnickoIme;
  }
  
  // korisnicko ime se koristi za razlicit prikaz ulogovanom ili izlogovanom korisniku
  res.render('index', { title: 'Home', korisnickoIme: korisnickoIme });
}

module.exports.index_get = index_get;