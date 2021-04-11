/**
 * Proverava da li je vrednost null, undefined ili NaN
 * 
 * @param {any} vrednost 
 * @returns {boolean} true ili false
 */
function nemaVrednost(vrednost) {
  return (vrednost == null || vrednost == undefined || vrednost == NaN);
};

module.exports.nemaVrednost = nemaVrednost;