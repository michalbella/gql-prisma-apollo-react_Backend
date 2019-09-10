// povolenie pouzitie fragmentov
import { extractFragmentReplacements } from 'prisma-binding'
// nacitavanie resolverov
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Post from './Post'
import Comment from './Comment'

const resolvers = {
    // resolvery pre mutacie, querying, subscription a parentov
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription
}

// prejde vsetky resolveri a pozrie ci su definovane fragmenty a v premennej fragment budu vsetky nase definicie ktore mame
const fragmentReplacements = extractFragmentReplacements(resolvers) // fragmenty ktore su v User.js, Post.js...

export { resolvers, fragmentReplacements }