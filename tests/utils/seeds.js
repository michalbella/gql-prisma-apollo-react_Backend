import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
    input: {
        name: 'Michal',
        email: 'test1@test.com',
        password: bcrypt.hashSync('password12345')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Peter',
        email: 'test2@test.com',
        password: bcrypt.hashSync('password12345')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'test post 1',
        body: 'empty',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'test post 2',
        body: 'empty 2',
        published: false,
    },
    post: undefined
}

const commentOne = {
    input: {
        text: 'commentOne by user Two'
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: 'commentTwo by user One'
    },
    comment: undefined
}

const seeds = async () => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyComments();

    // * User 1
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({
        userId: userOne.user.id
    }, process.env.JWT_SECRET)

    // * User 1
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({
        userId: userTwo.user.id
    }, process.env.JWT_SECRET)

    // * post 1
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // * post 2
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // * Comment 1
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

    // * Comment 2
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

}

export {
    seeds as default,
    userOne,
    userTwo,
    postOne,
    postTwo,
    commentOne,
    commentTwo
}