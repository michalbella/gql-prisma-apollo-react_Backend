import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'
import generateToken from '../utils/generateToken'

// Resolvers pre Mutations - CRUD operacie + PRISMA + AUTHORIZACIE
const Mutation = {
	// * User
	async createUser(parent, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.inputData.email })

		if (emailTaken) {
			throw new Error('Email taken');
		}

		const password = await hashPassword(args.inputData.password)

		// nove data sa passnu do info aby sa dali vsade pouzivat potom cez tento argument
		const user = await prisma.mutation.createUser({ 
			data: {
				...args.inputData,
				password
			} 
		}) // nemoze byt argument info lebo failne

		return {
			user,
			token: generateToken(user.id)
		}

		// ! stary zapis
		// const emailTaken = data.users.some((user) => {
		// 	// ak je TRUE email je taken -> throw error
		// 	return user.email === args.inputData.email;
		// });

		// if (emailTaken) {
		// 	throw new Error('Email taken');
		// }

		// const user = {
		// 	id: uuid4(),
		// 	...args.inputData  // mail, name, age
		// };

		// data.users.push(user);

		// return user;
	},
	async login(parent, args, { prisma }, info) {
		const user = await prisma.query.user({
			where: {
				email: args.inputData.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.inputData.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
			user,
			token: generateToken(user.id)
        }
    },
	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		// nove data sa passnu do info aby sa dali vsade pouzivat potom cez tento argument
		return prisma.mutation.deleteUser({ 
			where: {
				// * video 72 zmazane args.id moze sa zmazat len svoj ucet
				id: userId
			}
		 }, info)

		// ! stary zapis
		// const userIndex = data.users.findIndex((user) => {
		// 	return user.id === args.id; // existencia usera pomocou findIndex metody
		// });

		// if (userIndex === -1) {
		// 	throw new Error('User with the given ID not found');
		// }

		// const deletedUsers = data.users.splice(userIndex, 1);

		// // po zmazani pouzivatela treba zmazat aj posty a komenty lebio bude hadzat non nullable chybu
		// data.posts = data.posts.filter((post) => {
		// 	const match = post.author === args.id;

		// 	if (match) {
		// 		data.comments = data.comments.filter((comment) => {
		// 			return comment.post === post.id;
		// 		});
		// 	}
		// 	return !match;
		// });

		// data.comments = data.comments.filter((comment) => comment.author !== args.id);

		// return deletedUsers[0];
	},
	async updateUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		if (args.inputData.password) {
			args.inputData.password = await hashPassword(args.inputData.password)
		}
		return prisma.mutation.updateUser({
			// prvy argument - uniq podla ktoreho ideme robit update mutaciu
			where: {
				// * video 72 zmazane args.id moze sa updatnut len svoj ucet
				id: userId // mozem updatnut len sam seba - zoberie ID z tokenu
			},
			// druhy argument data ktore sa budu updatovat podla schemy
			data: args.inputData
		}, info) // info - aby sme mali pristup k datam id,name, ...

		// ! stary zapis
		// const { inputData, id } = args;

		// const user = data.users.find((user) => user.id === id);

		// if (!user) {
		// 	throw new Error('user not found');
		// }

		// if (typeof inputData.email === 'string') {
		// 	const emailTaken = data.users.some((user) => user.email === inputData.email);

		// 	if (emailTaken) {
		// 		throw new Error('Email taken');
		// 	}

		// 	user.email = inputData.email;
		// }

		// if (typeof inputData.name === 'string') {
		// 	user.name = inputData.name;
		// }

		// if (typeof inputData.age !== 'undefined') {
		// 	user.age = inputData.age;
		// }

		// return user;
	},
	// * Post
	createPost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		return prisma.mutation.createPost({
			data: {
				title: args.inputData.title,
				body: args.inputData.body,
				published: args.inputData.published,
				author: {
					connect: {
						// id: args.inputData.author
						id: userId // id z rozdekodovaneho tokenu vo funkcii getUserId
						// bude posielat id z tokenu a nie na tvrdo napisane ID! - zmenit treba aj v scheme
					}
				}
			}
		}, info)
	
		// ! stary zapis
		// const userExists = data.users.some((user) => {
		// 	// user pre Post existuje
		// 	return user.id === args.inputData.author;
		// });

		// if (!userExists) {
		// 	throw new Error('user not found');
		// }

		// const post = {
		// 	id: uuid4(),
		// 	...args.inputData
		// };
		
		// data.posts.push(post);

		// if (args.inputData.published) {
		// 	// * Subscribe pre create comment
		// 	// pubsub.publish('post', { post })
		// 	pubsub.publish('post', { 
		// 		// tento objekt je pre type PostSubscriptionPayload
		// 		// obsahuje type mutacie a data
		// 		post: {
		// 			// random  string upper case - aby sme identifikovali ze sa jedna o create mutaciu
		// 			mutation: 'CREATED', 
		// 			data: post
		// 		}
		// 	})
		// }

		// return post;
	},
	async deletePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)
		// nemozno do wheu dat author id preto sa musi spravit takato podmienka
		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})
		// ak existuju args.id a userId pre authora vrati true
		if (!postExists) {
			throw new Error('post does not exist') // nemoze zmazat iny user niekomu druhemu post
		}
		return prisma.mutation.deletePost({ 
			where: {
				id: args.id
			}
		 }, info)

		 // ! stary zapis
		// const postIndex = data.posts.findIndex((post) => {
		// 	return post.id === args.id;
		// });

		// if (postIndex === -1) {
		// 	throw new Error('Post with the given ID not found');
		// }
		// const [ post ] = data.posts.splice(postIndex, 1);

		// // deletedPosts[0]
		// data.comments = data.comments.filter((comment) => comment.post !== args.id);

		// if (post.published) {
		// 	// * Subscribe pre delete comment
		// 	pubsub.publish('post', { 
		// 		post: {
		// 			mutation: 'DELETED', 
		// 			data: post
		// 		}
		// 	})
		// }
		
		// return post;
	},
	async updatePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})
		
		const isPublished = await prisma.exists.Post({
			id: args.id,
			published: true
		})

		if (!postExists) {
			throw new Error('post does not exist')
		}

		// ak existuje isPublished post ale ide sa unpublishnut
		if (isPublished && args.inputData.published === false) {
			// zmazat vsetky komenty k tomuto postu pomocou mutacie deleteManyComments a posts vo where
			await prisma.mutation.deleteManyComments({ where: { post: { id: args.post } } })
		}

		return prisma.mutation.updatePost({
			where: {
				id: args.id
			},
			data: args.inputData
		}, info)

		// ! stary zapis
		// const { inputData, id } = args;

		// const post = data.posts.find((post) => post.id === id);
		// const originalPost = { ...post }

		// if (!post) {
		// 	throw new Error('post not found');
		// }

		// if (typeof inputData.title === 'string') {
		// 	post.title = inputData.title;
		// }

		// if (typeof inputData.body === 'string') {
		// 	post.body = inputData.body;
		// }

		// if (typeof inputData.published === 'boolean') {
		// 	post.published = inputData.published;
		// 	if (originalPost.published && !post.published) {
		// 		// bol published original post a teraz uz neni ? - DELETED
		// 		pubsub.publish('post', { 
		// 			post: {
		// 				mutation: 'DELETED', 
		// 				data: originalPost
		// 			}
		// 		})
		// 	} else if (!originalPost.published && post.published) {
		// 		// CREATED
		// 		pubsub.publish('post', { 
		// 			post: {
		// 				mutation: 'CREATED', 
		// 				data: post
		// 			}
		// 		})
		// 	}
		// } else if (post.published){
		// 	// UPDATED
		// 	pubsub.publish('post', { 
		// 		post: {
		// 			mutation: 'UPDATED', 
		// 			data: post
		// 		}
		// 	})
		// }

		// return post;
	},
	// * Comment
	async createComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const publishedPost = await prisma.exists.Post({
			id: args.inputData.post,
			published: true
		})

		if (!publishedPost) {
			throw new Error('post is not published')
		}

		return prisma.mutation.createComment({
			data: {
				text: args.inputData.text,
				author: {
					connect: {
						id: userId 
					}
				},
				post: {
					connect: {
						id: args.inputData.post
					}
				}
			}
		}, info)

		// ! stary zapis
		// const userExists = data.users.some((user) => user.id === args.inputData.author);

		// if (!userExists) {
		// 	throw new Error('user not found');
		// }

		// const postExists = data.posts.some((post) => post.id === args.inputData.post && post.published);

		// if (!postExists) {
		// 	throw new Error('post does not exist or not published');
		// }

		// const comment = {
		// 	id: uuid4(),
		// 	...args.inputData
		// };
		// // * Subscribe pre create comment
		// data.comments.push(comment);
		// // 2 argumenty - 1. channel name 2. data ktore chceme publishnut
		// // post ID a 
		// pubsub.publish(`comment ${comment.post}`, {
		// 	comment: {
		// 		mutation: 'CREATED',
		// 		data: comment
		// 	}
		// })

		// return comment;
	},
	async deleteComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId
			}
		})

		if (!commentExists) {
			throw new Error('comment does not exist')
		}

		return prisma.mutation.deleteComment({ 
			where: {
				id: args.id
			}
		 }, info)

		// ! stary zapis
		// const commentIndex = data.comments.findIndex((comment) => {
		// 	return comment.id === args.id;
		// });

		// if (commentIndex === -1) {
		// 	throw new Error('Comment with the given ID not found');
		// }

		// const [ deletedComment ] = data.comments.splice(commentIndex, 1);

		// pubsub.publish(`comment ${deletedComment.post}`, {
		// 	comment: {
		// 		mutation: 'DELETED',
		// 		data: deletedComment
		// 	}
		// })

		// return deletedComment;
	},
	async updateComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId
			}
		})

		if (!commentExists) {
			throw new Error('comment does not exist')
		}
		return prisma.mutation.updateComment({
			where: {
				id: args.id
			},
			data: args.inputData
		}, info)

		// ! stary zapis
		// 	const { inputData, id } = args;

		// 	const comment = data.comments.find((comment) => comment.id === id);

		// 	if (!comment) {
		// 		throw new Error('comment not found');
		// 	}

		// 	if (typeof inputData.text === 'string') {
		// 		comment.text = inputData.text;
		// 	}

		// 	pubsub.publish(`comment ${comment.post}`, {
		// 		comment: {
		// 			mutation: 'UPDATED',
		// 			data: comment
		// 		}
		// 	})

		// 	return comment;
	}
};

export { Mutation as default };
