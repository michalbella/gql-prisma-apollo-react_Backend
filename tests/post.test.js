import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import seeds, {
    userOne, postOne, postTwo
} from './utils/seeds'
import getClient from './utils/getClient'
import prisma from '../src/prisma';
import { 
    GET_POSTS,
    GET_MY_POSTS,
    UPDATE_POST,
    CREATE_POST,
    DELETE_POST 
} from './utils/operations'

const client = getClient()

beforeEach(seeds)

// ! GET POSTS
test('[GET]: should return published posts ', async () => {
    const response = await client.query({
        query: GET_POSTS
    });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

// ! GET MY POSTS
test('[GET]: should fetch my posts', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({
        query: GET_MY_POSTS
    })

    expect(data.myPosts.length).toBe(2)
});

// ! UPDATE OWN POST
test('[UPDATE]: should update own post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    }
    const { data } = await client.mutate({ mutation: UPDATE_POST, variables })
    const exist = await prisma.exists.Post({ id: postOne.post.id, published: false })

    expect(data.updatePost.published).toBe(false)
    expect(exist).toBe(true)
});

// ! CREATE POST
test('[CREATE]: should create post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        data: {
            title: "test post 3",
            body: "aaaa",
            published: false
        }
    }
    
    await client.mutate({ mutation: CREATE_POST, variables })
    const exist = await prisma.exists.Post({ title: 'test post 3' })

    expect(exist).toBe(true)
});

// ! DELETE POST
test('[DELETE]: should delete post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: postTwo.post.id
    }
    
    await client.mutate({ mutation: DELETE_POST, variables })
    const exist = await prisma.exists.Post({ title: 'test post 2' })

    expect(exist).toBe(false)
});