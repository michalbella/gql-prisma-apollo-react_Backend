import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import prisma from '../src/prisma';
import seeds, { userOne } from './utils/seeds';
import getClient from './utils/getClient';
import {
   LOGIN,
   CREATE_USER,
   GET_PROFILE,
   GET_USERS
} from './utils/operations';

const client = getClient()

beforeEach(seeds)

// ! CREATE USER
test('[CREATE]: should create a new user', async () => {
   // GraphQL Variables data: $variable_name
   const variables = {
      data: {
         name: "Michal",
         email: "test2@gmail1.com",
         password: "123red123"
      }
   }

   const response = await client.mutate({
      mutation: CREATE_USER,
      // optional argument - VARIABLES
      variables
   });
   // uz sa nekontroluje status 200,400,404 atd lebo vsetko pride ako 200 aj ked je unauthorized, bad request a pod...
   // ci sa vytvoril pouzivatel DB podla nasej mutacie createUser a v response sa poslalo ID ktore musi byt rovnake ako v DB
   const exists = await prisma.exists.User({
      id: response.data.createUser.user.id
   });
   expect(exists).toBe(true);
});

// ! GET USERS
test('[GET]: should fetch public author profile ', async () => {
   const response = await client.query({
      query: GET_USERS
   });

   expect(response.data.users.length).toBe(2);
   expect(response.data.users[0].email).toBe(null);
   expect(response.data.users[0].name).toBe('Michal');

});

// ! POST LOGIN REJECT
// * testovanie chyb pri testovch  -> toThrow() -> https://jestjs.io/docs/en/expect#rejects
test('[POST]: should not login with that creds - bad mail or password', async () => {
   const variables = {
      data: {
         email: "test@gmail1.com",
         password: "wrongpassword"

         // ? ak budu prihlasovacie udaje dobre, promisa sa resolvne a test neprejde
         // Received promise resolved instead of rejected
         // email:"test@gmail1.com"
         // password: "password12345"
      }
   }

   await expect(
      client.mutate({
         mutation: LOGIN,
         variables
      })
   ).rejects.toThrow('Unable to login')
});

// ! CREATE USER REJECT
// * testovanie chyb pri testovch  -> toThrow()
test('[POST]: should not create user with that creds - short password', async () => {
   const variables = {
      data: {
         name: "Michal",
         email: "test2@gmail1.com",
         password: "123"
      }
   }

   await expect(
      client.mutate({
         mutation: CREATE_USER,
         variables
      })
   ).rejects.toThrow('min 8 characters')
});

// ! GET USER PROFILE
// * testovanie chyb pri testovch  -> toThrow()
test('[GET]: should fetch user profile', async () => {
   const client = getClient(userOne.jwt)
   const { data } = await client.query({
      query: GET_PROFILE
   })

   expect(data.me.id).toBe(userOne.user.id)
});