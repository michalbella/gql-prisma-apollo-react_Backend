import { gql } from 'apollo-boost';

// * GraphQL Test Queryies
// $data su gql variables ktore su definovane priamo v test suitoch ako druhy argument client.mutate()

// ! USER
// * Create User Query
const CREATE_USER = gql `
   mutation($data: CreateUserInput!) {
      createUser(
         inputData: $data
         ){
         token,
         user {
            id
            name
            email
         }
      }
   }
`;

// * Get Users Query
const GET_USERS = gql `
   query {
      users{
         id
         name
         email
      }
   }
`;

// * Login Query
const LOGIN = gql `
   mutation($data: LoginUserInput!) {
      login(
         inputData: $data
      ){
         token
      }
   }
`
// * Get Profile Query
const GET_PROFILE = gql `
   query {
      me {
         id
         name
         email
      }
   }
`
// ! POST Operations
// * Get Posts
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
// * Get My Posts
const GET_MY_POSTS = gql `
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`
// * Update Post
const UPDATE_POST = gql `
    mutation($id: ID!, $data: UpdatePostInput!) {
        updatePost(
            id: $id
            inputData: $data
        ){
            id
            title
            body
            published
        }
    }
`
// * Create Post
const CREATE_POST = gql `
    mutation($data: CreatePostInput!) {
        createPost(
            inputData: $data
        ){
            id
            title
            body
            published
        }
    }
`
// * Delete Post
const DELETE_POST = gql `
    mutation($id: ID!) {
        deletePost(
            id: $id
        ){
            id
            title
            body
            published
        }
    }
`

// * Delete Post
const DELETE_COMMENT = gql `
    mutation($id: ID!) {
        deleteComment(
            id: $id
        ){
            id
            text
        }
    }
`
export {
    CREATE_USER,
    GET_USERS,
    LOGIN,
    GET_PROFILE,
    GET_POSTS,
    GET_MY_POSTS,
    UPDATE_POST,
    CREATE_POST,
    DELETE_POST,
    DELETE_COMMENT
}