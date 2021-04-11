const PORT = 8080;

function serverPokrenutPoruka() {
  console.log(`Server started on: http://localhost:${PORT}`)
}

/**
 * Prima express app, pokrece server i ispisuje poruku u konzoli da je pokrenut
 * @param {*} app 
 */
function pokreniServer(app) {
  app.listen(PORT, serverPokrenutPoruka);
}

module.exports.pokreniServer = pokreniServer;