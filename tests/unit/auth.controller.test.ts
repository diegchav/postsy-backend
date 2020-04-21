import request from 'supertest'
import { BAD_REQUEST, OK } from 'http-status-codes'

import app from '../../src/server'
import DBHandler from '../db-handler'
import { BASE_PATH, AUTH_PATH } from '../../src/constants'

const apiPath = BASE_PATH + AUTH_PATH
const dbHandler = new DBHandler()

/**
 * Mock data.
 */
const userValid = {
    username: 'Alex',
    password: 'password1234',
    email: 'alex@example.com'
}

const userMissingUsername = {
    password: 'password1234',
    email: 'alex@example.com'
}

const userMissingPassword = {
    username: 'Alex',
    email: 'alex@example.com'
}

const userMissingEmail = {
    username: 'Alex',
    password: 'password1234',    
}

const userInvalidUsernameMinLength = {
    username: 'Al',
    password: 'password1234',
    email: 'alex@example.com'
}

const userInvalidUsernameMaxLength = {
    username: 'AlexAlexAlexAlexAlex',
    password: 'password1234',
    email: 'alex@example.com'
}

const userInvalidPasswordMinLength = {
    username: 'Alex',
    password: 'password',
    email: 'alex@example.com'
}

const userInvalidEmail = {
    username: 'Alex',
    password: 'password1234',
    email: 'alex@example'
}

/**
 * Connect to a new in-memory database.
 */
beforeAll(async () => {
    await dbHandler.connect()
})

/**
 * Clear all db data before each test.
 */
afterEach(async () => {
    await dbHandler.clearDatabase()
})

/**
 * Remove and close the db.
 */
afterAll(async () => {
    await dbHandler.closeDatabase()
})

/**
 * AuthController test suite.
 */
describe('AuthController', () => {
    describe('POST /signup', () => {
        /**
         * Test that a user with valid requirements can be signed up.
         */
        it('should sign up a user', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userValid)
                .expect(OK)
                .expect('Content-Type', /json/)

            expect(res.body.user.username).toBe(userValid.username.toLowerCase())
            expect(res.body.user.email).toBe(userValid.email)
        })

        /**
         * Test sign up fails if username is missing.
         */
        it('should fail if username is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingUsername)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)
            
            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if password is missing.
         */
        it('should fail if password is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingPassword)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)
            
            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if email is missing.
         */
        it('should fail if email is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingEmail)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if username length is less than required.
         */
        it('should fail if username length is less than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidUsernameMinLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if username length is greater than required.
         */
        it('should fail if username length is greater than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidUsernameMaxLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if password length is less than required.
         */
        it('should fail if password length is less than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidPasswordMinLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.errors).toBeDefined()
        })

        /**
         * Test sign up fails if email is invalid.
         */
        it('should fail if email is invalid', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidEmail)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.errors).toBeDefined()
        })
    })
})