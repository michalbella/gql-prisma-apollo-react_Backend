import getUserId from '../utils/getUserId'
// PARENT FIELDS
const User = {
	// lockovanie selection setu ktory vybehne z Usera
	// v posts a myPosts je zakazane zobrazovat published false posty, ale query users tu su povolene - treba OSETRIT
	// email z Usera sa zobrazi len v profile me() ale nezobrazi sa v users()
	// osetrenie ze z emailu sa spravi resolver
	
	// ! bez fragmentu
	// ak neziadame o parent.id tak podmienka padne a vrati vzdy null pre email aj ked chceme pozriet svoj
	// email(parent, args, { request }, info) {
	// 	const userId = getUserId(request, false)
	// 	// podmienka ci pouzivatel chce pozriet svoj profil - vratime email z parentu
	// 	if (userId && userId === parent.id) {
	// 		return parent.email
	// 	} else {
	// 		// v opacnom pripade nezobrazime email - v query users, posts...
	// 		return null
	// 	}
	// }

	// ! s pouzitim fragmentu
	posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    },
	email: {
		// spristupnime ID inak by zbehlo do else return null, ak by sa neprovidla ziadost o ID
		fragment: 'fragment userId on User { id }', 
		resolve(parent, args, { request }, info) {
			const userId = getUserId(request, false)
			// podmienka ci pouzivatel chce pozriet svoj profil - vratime email z parentu
			if (userId && userId === parent.id) {
				return parent.email
			} else {
				// v opacnom pripade nezobrazime email - v query users, posts...
				return null
			}
		}
	}

	// ! stary zapis -> N + 1 problem
	// 3 users - 3x sa zavola tento resolver
	// posts: (parent, args, { data }, info) => {
	// 	return data.posts.filter((post) => {
	// 		return post.author === parent.id;
	// 	});
	// },
	// comments: (parent, args, { data }, info) => {
	// 	return data.comments.filter((comment) => {
	// 		return comment.post === parent.comment;
	// 	});
	// }
};

export { User as default };
