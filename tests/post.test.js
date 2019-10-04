import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import  { gql } from 'apollo-boost';
import seeds from './utils/seeds'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seeds)

test('should return published posts ', async () => {
    const GET_POSTS = gql `
       query {
          posts {
             id
             title
             body
             published
          }
       }
    `
    const response = await client.query({
       query: GET_POSTS
    });
 
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
 });