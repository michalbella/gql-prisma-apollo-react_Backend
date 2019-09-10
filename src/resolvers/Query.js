import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        // vdaka info mozeme passovat aj relacie z User.js - vsetky informacie SCALAR + RELATION FIELDS
        const opArgs = {
            // PAGINATION
            first: args.first,
            skip: args.skip,
            after: args.after,
            // SORTING
            orderBy: args.orderBy
        } 
        // queryString definovany v scheme ako operation argument
        // sluzi na vyhladavanie vo where
        if (args.queryString) {
            opArgs.where = {
                OR: [{
                    name_contains: args.queryString
                }, {
                    email_contains: args.queryString
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = { 
            where: {
                published: true
            },
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if (args.queryString) {
            opArgs.where.OR = [{
                title_contains: args.queryString
            }, {
                body_contains: args.queryString
            }]
        }

        return prisma.query.posts(opArgs, info)
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = { 
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.queryString) {
            opArgs.where.OR = [{
                title_contains: args.queryString
            }, {
                body_contains: args.queryString
            }]
        }

        return prisma.query.posts(opArgs, info)
    },

    comments(parent, args, { prisma }, info) {
        // PUBLIC
        const opArgs = { 
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        // PRIVATE
        // svoj profil
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId,
            }
        })
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        // userId zastavi ak nie je autentifikovany pouzivatel, ale ak chceme aj pre neautentifikovanych pouzivatelov spristupnit return
        // z tejto Query treba poslat druhy argument // ! requireAuth -  handlovanie auth/neauth pouzivatelov
        // false - neije potrebne autentifikacia a nebude hadzat chybu ak mame pouzivatela bez tokenu
        const posts = await prisma.query.posts({
            // cez where si vyfiltrujem len jeden post podla unique IDcka - podla struktury na 4466
            // pre neautentifikovanych - post podla ID, ktory je publiushed a od autora seba
            where: {
                id: args.id,
                OR: [{
                    // pre neautentifikovanych pojdu len published true
                    published: true,
                },{
                    // ak je auth token pojde aj published false
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('post not found')
        }
        return posts[0]
    }
}

export { Query as default }