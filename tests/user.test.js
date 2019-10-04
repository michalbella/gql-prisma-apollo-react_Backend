import 'cross-fetch/polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import prisma from '../src/prisma';
import { gql } from 'apollo-boost';
import seeds from './utils/seeds'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seeds)

test('should create a new user', async () => {
   const CREATE_USER = gql `
		mutation {
			createUser(inputData: { name: "novy user 55", email: "TEST1@gmail.com", password: "12345678" }) {
				user {
					id
					name
					email
					password
				}
				token
			}
		}
	`;

   const response = await client.mutate({
      mutation: CREATE_USER
   });

   // uz sa nekontroluje status 200,400,404 atd lebo vsetko pride ako 200 aj ked je unauthorized, bad request a pod...
   // ci sa vytvoril pouzivatel DB podla nasej mutacie createUser a v response sa poslalo ID ktore musi byt rovnake ako v DB
   const exists = await prisma.exists.User({
      id: response.data.createUser.user.id
   });
   expect(exists).toBe(true);
});

test('test: public author profile ', async () => {
   const GET_USERS = gql `
      query {
         users{
            id
            name
            email
         }
      }
   `;

   const response = await client.query({
      query: GET_USERS
   });

   expect(response.data.users.length).toBe(1);
   expect(response.data.users[0].email).toBe(null);
   expect(response.data.users[0].name).toBe('Michal');

});

// ! testovanie chyb pri testovch  -> toThrow()

test('should not login with that creds - bad mail or password', async () => {
   const LOGIN = gql `
      mutation {
         login(
            inputData:{
               email:"BADMAIL@gmail.com"
               password: "wrongpassword"

               # // * ak budu prihlasovacie udaje dobre, promisa sa resolvne a test neprejde
               # Received promise resolved instead of rejected
               # email:"test@gmail1.com"
               # password: "password12345"
            }
         ){
            token
         }
      }
   `

   await expect(
      client.mutate({
         mutation: LOGIN
      })
      // * https://jestjs.io/docs/en/expect#rejects
   ).rejects.toThrow('Unable to login')

   // expect(() => {
   //    throw new Error('error')
   // }).toThrow()

});

test('should not login with that creds - short password', async () => {
   const CREATE_USER = gql `
      mutation {
         createUser(
            inputData:{
               name: "Michal"
               email:"test2@gmail1.com"
               password: "123"
            }
         ){
            token
         }
      }
   `
   await expect(
      client.mutate({
         mutation: CREATE_USER
      })
   ).rejects.toThrow('min 8 characters')
});