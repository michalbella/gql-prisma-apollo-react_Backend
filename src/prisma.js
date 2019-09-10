import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    // * tu sa nastavi Node pre pripojenie na Prisma endpoint
    // pristup k metodam prisma. mutation, query, exists ...
    // ak mame typ User vygeneruje sa mu automaticky createUser, updateUser subscrioptions, query
	typeDefs: './src/generated/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'p@ssw0rd', // aby sme mali pristup k 4000, 4466 bude stale locknuta iba s tokenom sa k nej dostaneme
    fragmentReplacements // definovane fragmenty
});

export { prisma as default }

// ! zmazat - PLAYGROUND s async/await a promise
// Integrovanie resolverov
// prisma obsahuje metody pre existujuce mutacie, subscriptions, query
// metod name = query name - null lebo operation argumenty niesu potrebne pri query, druhy argument selection-set veci ktore chceme z users

// PRISMA BINDING - vracia Promisu treba then a tam returnut data nie priamo
// prisma.query.users(null, '{ id name email posts { id title } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.createPost({
//     data: {
//         title: "new title 2",
//         body: "",
//         published: false,
//         author: {
//             connect:{
//                 id: "cjy67ztgj00hz070303qegjvh"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
//     return prisma.query.users(null, '{ id name email posts { id title } }').then((data) => {
//         console.log(JSON.stringify(data, undefined, 2))
//     })
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
//     data: {
//         body: "update",
//         published: true
//     },
//     where:{
//         id: "cjy7qcbd300p80703gii8dio4"
//       }
// }, '{ body published }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

//! pomocou ASYNC/AWAIT


// const createPostForUser = async (authorId, data) => {
//     // * Validacie
//     const userExists = await prisma.exists.User({ id: authorId })

//     if (!userExists) {
//         throw new Error('user not found')
//     }
    
//     // Create new post
// 	const post = await prisma.mutation.createPost({
// 		data: {
// 			...data,
// 			author: {
// 				connect: {
// 					id: authorId
// 				}
//             }
// 		}
//     }, '{ author { name email posts { id title published } }  }')

//     return post
// }

// createPostForUser('cjy67ztgj00hz070303qegjvh', {
//     title: 'novy post',
//     body: 'lorem ipsum',
//     published: true
// }).then((user)=> {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId })

//     if (!postExists) {
//         throw new Error('post not found')
//     }
//     // Create new post
// 	const post = await prisma.mutation.updatePost({
// 		where: {
// 			id: postId,
			
// 		}, data
//     }, '{ author { id name email posts { id title published } } }')

//     return post
// }

// updatePostForUser('cjy7q6nmm00ot0703s24upuj7', {
//     title: 'novy post',
//     body: 'lorem ipsum',
//     published: false
// }).then((user)=> {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })