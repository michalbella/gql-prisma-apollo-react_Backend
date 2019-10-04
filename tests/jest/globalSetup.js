require('@babel/register');
require('@babel/polyfill/noConflict');

const server = require('../../src/server').default;

module.exports = async () => {
    // globalny pristup k tejto httpServer premennej v celom projekte
	global.httpServer = await server.start({ port: 4000 });
};

// jdbc:postgresql://localhost:5432/graphql_test