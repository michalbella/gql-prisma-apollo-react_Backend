import getUserId from '../utils/getUserId'

const Subscription = {
    comment: {
        subscribe(parent, { postId }, { prisma }, info){
            // null je where argument ktory je optional
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                }
            }, info)

            // ! stary zapis
            // const post = data.posts.find((post) => post.id === postId && post.published)

            // if (!post) {
            //     throw new Error('post not found')
            // }

            // return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { prisma }, info){
            return prisma.subscription.post({ 
                where: {
                    node: {
                        published: true
                    }
                }
             }, info)

            // ! stary zapis
            // return pubsub.asyncIterator('post')
        }
    },
    myPost: {
        subscribe(parent, args, { prisma, request }, info){
            const userId = getUserId(request)
            // len svoje posty mozem pozriet porovnaju sa ID z toikenu a userID
            return prisma.subscription.post({ 
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
             }, info)
        }
    }
};

export { Subscription as default };
