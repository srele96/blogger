const { nemaVrednost } = require('./nemaVrednost');

/**
 * Sastavlja poruku o greskama
 * 
 * @param {number} min - minimalan broj karaktera
 * @param {string} sta - sta se proverava
 * @param {number} [max=null] - opcionalno, maksimalan broj karaktera
 * @returns {string} koliko karaktera sta parametar mora da sadrzi
 */
 function greskaPoruka(min, sta, max=null) {
  if(max === null) {
    return `${sta} mora da ima najmanje - ${min} karaktera`;
  } else {
    return `${sta} mora da ima izmedju - [${min}, ${max}] karaktera`;
  }
}

/**
 * Proverava da li dat text ima trazen broj karaktera
 * 
 * @param {number} min - minimalan broj karaktera
 * @param {string} text - tekst cija se duzina proverava
 * @param {number} [max=null] - opcionalno, maksimalan broj karaktera
 * @returns {boolean} true | false
 */
function imaDovoljnoKaraktera(min, text, max=null) {
  const duzinaTeksta = text.length;
  // max nije prosledjen
  if(max === null) {
    if(min <= duzinaTeksta) return true;
    else return false;
  } else {
    if(min <= duzinaTeksta && duzinaTeksta <= max) return true;
    else return false;
  }
}

/**
 * Prikazuje poruke o premalo ili previse unetih karaktera.
 * 
 * @param {string} text - tekst cija se duzina proverava
 * @param {number} min - minimalan broj karaktera
 * @param {*} res - http response
 * @param {string} sta - sta se proverava
 * @param {number} [max=null] - opcionalno, maksimalan broj karaktera
 * @returns {Promise} Promise
 */
function nemaDovoljnoKaraktera(text, min, res, sta, max=null) {
  return new Promise((resolve, reject) => {
    if(nemaVrednost(text)) reject('Text nije definisan');
    if(nemaVrednost(min)) reject('Min nije definisan');
    if(nemaVrednost(res)) reject('Response nije definisan');
    if(nemaVrednost(sta)) reject('Sta nije definisan');

    if(!imaDovoljnoKaraktera(min, text, max)) {
      // nema dovoljnoa karaktera, prikazi gresku i reject
      const poruka = greskaPoruka(min, sta, max);
      
      res.render('greska', {
        title: 'Greska',
        poruka: poruka
      });

      reject(poruka);
    } else {
      const nemaDovoljnoKaraktera = false;
      resolve(nemaDovoljnoKaraktera);
    }
  });
}

/**
 * Ako komentar nema dovoljno karaktera, prikazuje poruku o gresci.
 * 
 * SAMO ZA DODAVANJE KOMENTARA SE KORISTI!
 * 
 * - Komentar je jedina ruta koja zahteva prikaz greske preko pogleda 'poruka'
 * da bi omogucio korisniku da se vrati na komentar preko prosledjivanja linka 
 * posta.
 * 
 * @param {string} text - sadrzaj komentara
 * @param {number} min - min broj karaktera
 * @param {*} res - da ispise korisniku poruku o gresci
 * @param {string} sta - ciji broj karaktera se proverava
 * @param {number} id - id objave na koju se objavljuje komentar
 * @param {string} korisnickoIme - korisnik koji objavljuje komentar
 * @returns {Promise} - Promise
 */
 function komentarNemaDovoljnoKaraktera(text, min, res, sta, id, korisnickoIme) {
  return new Promise((resolve, reject) => {
    if(nemaVrednost(text)) reject('Text nije definisan');
    if(nemaVrednost(min)) reject('Min nije definisan');
    if(nemaVrednost(res)) reject('Response nije definisan');
    if(nemaVrednost(sta)) reject('Sta nije definisan');
    if(nemaVrednost(id)) reject('Id nije definisan');

    const imaDovoljnoKaraktera = min <= text.length;

    // nema dovoljno karaktera, prikazi gresku
    if(!imaDovoljnoKaraktera) {
      const poruka = 'komentar mora da ima najmanje' + 
      ` - ${min} karaktera`;
      
      res.render('poruka', {
        title: 'Greska',
        poruka: poruka,
        putanja: `/objava/${id}`,
        linkText: 'Vrati me na objavu',
        korisnickoIme: korisnickoIme
      });
      
      reject(poruka);
    }
    // ako ima dovoljno karaktera nastavi
    else {
      const nemaDovoljnoKaraktera = false;
      resolve(nemaDovoljnoKaraktera);
    }
  });
}

module.exports.nemaDovoljnoKaraktera = nemaDovoljnoKaraktera;
module.exports.komentarNemaDovoljnoKaraktera = komentarNemaDovoljnoKaraktera;