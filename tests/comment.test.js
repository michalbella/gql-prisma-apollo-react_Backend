import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import prisma from '../src/prisma';
import seeds, {
    userOne, userTwo, commentOne, commentTwo
} from './utils/seeds'
import getClient from './utils/getClient';
import {
   DELETE_COMMENT
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