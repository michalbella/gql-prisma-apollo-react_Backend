import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import prisma from '../src/prisma';
import seeds, {
    userOne, commentOne, commentTwo, postOne
} from './utils/seeds'
import getClient from './utils/getClient';
import {
   DELETE_COMMENT,
   SUBSCRIBE_COMMENT,
   SUBSCRIBE_POST
} from './utils/operations';

const client = getClient()

beforeEach(seeds)

// ! DELETE OTHER COMMENT - REJECT
test('[DELETE]: should not delete comment by other user', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        // userOne nenapisal commentOne
        id: commentOne.comment.id 
    }

    await expect(
        client.mutate({ mutation: DELETE_COMMENT, variables })
    ).rejects.toThrow()
    // expect(exist).toBe(true)
});

// ! DELETE OWN COMMENT
test('[DELETE]: should delete own comment', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        // userOne napisal commentTwo
        id: commentTwo.comment.id 
    }
    await client.mutate({ mutation: DELETE_COMMENT, variables })
    const exist = await prisma.exists.Comment({ id: commentTwo.comment.id })

    expect(exist).toBe(false)
});

// TODO: testy pre GET, CREATE a UPDATE Commnets

// ! SUBSCRIBING COMMENT
test('[SUBSCRIBE]: should subscribe to commnet for a post', async (done) => {
    const variables = {
        postId: postOne.post.id
    }
    client.subscribe({ query: SUBSCRIBE_COMMENT, variables }).subscribe({
        // vzdy ked sa koment zmeni zavola sa next() - ked sa zmaze koment 1x
        // ak by bolo viac operacii createComment, updateComment, deleteCommnet tak sa zavola 3x
        next(response) {
            // * Assertion
            expect(response.data.comment.mutation).toBe('DELETED')
            // kod sa vykona az po tom ked test prejde - oneskorene
            // treba done lebo bez neho sa funkcia nestihne vykonat v async procese padne 
            // hned na mutation.deleteCommnet a next neberie do uvahy, preto treba pockat na done()
            // ! test nebude povazovany za dokonceny pokial sa nezavola done()
            done()
        }
    })
    // * Operacia nad comentom - napr. DELETE_COMMENT
    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
});

// ! SUBSCRIBING POST
test('[SUBSCRIBE]: should subscribe to changes for published post', async (done) => {
    client.subscribe({ query: SUBSCRIBE_POST }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED')
            done()
        }
    })
    // FIXME: autora treba dat do createPost
    // const inputData = {
    //     title: "post by subscription",
    //     body: "subscription",
    //     published: true
    //   }
    // await prisma.mutation.createPost({ data: inputData })
    
    await prisma.mutation.deletePost({ where: { id: postOne.post.id }})
});