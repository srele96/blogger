/**
 * Trenutni datum u formatu dd/mm/yyyy
 * 
 * @returns {string} datum
 */
function trenutniDatum() {
  const datum = new Date();
  return datum.getDate() + "/"
    + (datum.getMonth()+1)  + "/" 
    + datum.getFullYear();
}

/**
 * Trenutno vreme u formatu hh:mm
 * 
 * @returns {string} datum
 */
function trenutnoVreme() {
  const datum = new Date();
  return datum.getHours() + ":"  
    + datum.getMinutes() + "h"
}

module.exports.trenutniDatum = trenutniDatum;
module.exports.trenutnoVreme = trenutnoVreme;