import '@babel/polyfill/noConflict' // treba babel/polyfill, lebo babel nepozna polyfill pre prod, ide len v babel-node v deve (npm run start by crashol)
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers, fragmentReplacements } from './resolvers/index'
import prisma from './prisma'

const pubsub = new PubSub();
// GraphQL server
const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	// context aby sme mali pristup k datam v fakedata.js v kazdom resolvery ked su oddelene od seba
	// DB connection, auth tokens, prisma  ...
	// zmena objektu na funkciu pre passovanie tokenov a ich zmenu
	// spristupni k req aby sme mohlio passovat headers
	context: (request) => {
		return {
			pubsub,
			prisma,
			request
		}
	},
	fragmentReplacements // definovane fragmenty
})
server.start({ port: process.env.PORT || 4000 }, ({ port }) => {
	console.log(`The server is up at port ${port}`);
});


// localhost na 4000 sa presmeruje na GraphQL Quering playground
