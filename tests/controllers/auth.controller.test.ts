import request from 'supertest'
import { BAD_REQUEST, OK } from 'http-status-codes'
import setCookie from 'set-cookie-parser'

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

const userExistingUsername = {
    username: 'Alex',
    password: 'password1234',
    email: 'notalex@example.com'
}

const userExistingEmail = {
    username: 'NotAlex',
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
    password: 'pass',
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

            expect(res.body.user.username).toEqual(userValid.username.toLowerCase())
            expect(res.body.user.email).toEqual(userValid.email)
        })

        /**
         * Test sign up fails if username already exists.
         */
        it('should fail if username already exists', async () => {
            await request(app).post(apiPath + '/signup').send(userValid)
            const res = await request(app).post(apiPath + '/signup').send(userExistingUsername)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.username).toEqual('Username is already taken')
        })

        /**
         * Test sign up fails if email already exists.
         */
        it('should fail is email already exists', async () => {
            await request(app).post(apiPath + '/signup').send(userValid)
            const res = await request(app).post(apiPath + '/signup').send(userExistingEmail)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)
            
            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.email).toEqual('Email is already taken')
        })

        /**
         * Test sign up fails if username is missing.
         */
        it('should fail if username is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingUsername)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)
            
            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.username).toEqual('Username is required')
        })

        /**
         * Test sign up fails if password is missing.
         */
        it('should fail if password is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingPassword)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)
            
            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.password).toEqual('Password is required')
        })

        /**
         * Test sign up fails if email is missing.
         */
        it('should fail if email is missing', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userMissingEmail)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.email).toEqual('Email is required')
        })

        /**
         * Test sign up fails if username length is less than required.
         */
        it('should fail if username length is less than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidUsernameMinLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.username).toEqual('Username must be at least 3 characters')
        })

        /**
         * Test sign up fails if username length is greater than required.
         */
        it('should fail if username length is greater than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidUsernameMaxLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.username).toEqual('Username must be less than 16 characters')
        })

        /**
         * Test sign up fails if password length is less than required.
         */
        it('should fail if password length is less than required', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidPasswordMinLength)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.password).toEqual('Password must be at least 8 characters')
        })

        /**
         * Test sign up fails if email is invalid.
         */
        it('should fail if email is invalid', async () => {
            const res = await request(app).post(apiPath + '/signup')
                .send(userInvalidEmail)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.email).toEqual('Email is not valid')
        })
    })

    describe('POST /signin', () => {
        /**
         * Test that a user can sign in.
         */
        it('should sign in a user', async () => {
            // Sign up before signing in
            await request(app).post(apiPath + '/signup').send(userValid)
            const payload = { email: userValid.email, password: userValid.password }
            const res = await request(app).post(apiPath + '/signin')
                .send(payload)
                .expect(OK)
                .expect('Content-Type', /json/)

            expect(typeof res.body.token).toEqual('string')

            const cookies = setCookie.parse(res.header['set-cookie'])
            expect(cookies).toHaveLength(1)
            const jwtCookie = cookies[0]
            expect(jwtCookie.name).toEqual('jwt')
            expect(jwtCookie.httpOnly).toBe(true)
            expect(typeof jwtCookie.value).toEqual('string')
        })

        /**
         * Test sign in fails if user with a given email doesn't exist.
         */
        it(`should fail if user with a given email doesn't exist`, async () => {
            await request(app).post(apiPath + '/signup').send(userValid)
            const payload = { email: 'test@example.com', password: 'password' }
            const res = await request(app).post(apiPath + '/signin')
                .send(payload)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Authentication Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.error).toEqual('Invalid username or password')
        })

        /**
         * Test sign fails is provided password is incorrect.
         */
        it('should fail is provided password is incorrect', async () => {
            await request(app).post(apiPath + '/signup').send(userValid)
            const payload = { email: userValid.email, password: 'password' }
            const res = await request(app).post(apiPath + '/signin')
                .send(payload)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Authentication Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.error).toEqual('Invalid username or password')
        })

        /**
         * Test sign in fails if email is missing.
         */
        it('should fail is email is missing', async () => {
            const payload = { password: userValid.password }
            const res = await request(app).post(apiPath + '/signin')
                .send(payload)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.email).toEqual('Email is required')
        })

        /**
         * Test sign in fails if password is missing.
         */
        it('should fail if password is missing', async () => {
            const payload = { email: userValid.email }
            const res = await request(app).post(apiPath + '/signin')
                .send(payload)
                .expect(BAD_REQUEST)
                .expect('Content-Type', /json/)

            expect(res.body.message).toEqual('Validation Error')
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            const resError = res.body.errors[0]
            expect(resError.password).toEqual('Password is required')
        })
    })
})