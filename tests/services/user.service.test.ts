import * as mongoose from 'mongoose'
import { MongoError } from 'mongodb'

import DBHandler from '../db-handler'

import UserService from '../../src/services/user.service'

const dbHandler = new DBHandler()
const userService = new UserService()

/**
 * Mock data.
 */
const user = {
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
    await dbHandler.dropIndexes()
})

/**
 * Remove and close the db.
 */
afterAll(async () => {
    await dbHandler.closeDatabase()
})

/**
 * UserService test suite.
 */
describe('UserService', () => {
    describe('user create', () => {
        /**
         * Test that a user with valid requirements can be created.
         */
        it('should create a user', async () => {
            expect(async () => {
                await userService.create(user)
            })
            .not
            .toThrow()
        })

        /**
         * Test that a user's username is saved in lower case.
         */
        it(`should save user's username in lower case`, async () => {
            const createdUser = await userService.create(user)
            expect(createdUser.username).toEqual(user.username.toLowerCase())
        })

        /**
         * Test that usernames are unique.
         */
        it('should fail if a username already exists', async () => {
            await userService.create(user)
            expect(async () => {
                await expect(userService.create(userExistingUsername)).toThrow(MongoError)
            })
        })

        /**
         * Test that emails are unique.
         */
        it('should fail if an email already exists', async () => {
            await userService.create(user)
            expect(async () => {
                await expect(userService.create(userExistingEmail)).toThrow(MongoError)
            })
        })

        /**
         * Test user cannot be created if username is missing.
         */
        it('should fail if username is missing', async () => {
            await expect(userService.create(userMissingUsername)).rejects.toThrow(mongoose.Error)
        })

        /**
         * Test user cannot be created if password is missing.
         */
        it('should fail if password is missing', async () => {
            await expect(userService.create(userMissingPassword)).rejects.toThrow(mongoose.Error)
        })

        /**
         * Test user cannot be created if email is missing.
         */
        it('should fail is email is missing', async () => {
            await expect(userService.create(userMissingEmail)).rejects.toThrow(mongoose.Error)
        })

        /**
         * Test user cannot be created if username length is less than required.
         */
        it('should fail if username length is less than required', async () => {
            await expect(userService.create(userInvalidUsernameMinLength)).rejects.toThrow(mongoose.Error)
        })

        /**
         * Test user cannot be created if username length is greater than required.
         */
        it('should fail if username length is greater thatn required', async () => {
            await expect(userService.create(userInvalidUsernameMaxLength)).rejects.toThrow(mongoose.Error)
        })

        /**
         * Test user cannot be created if password length is less than required.
         */
        it('should fail if password length is less than required', async () => {
            await expect(userService.create(userInvalidPasswordMinLength)).rejects.toThrow(mongoose.Error)
        })
    })

    describe('user find by email', () => {
        /**
         * Test user can be found with a valid email.
         */
        it('should find an existing user through its email', async () => {
            const createdUser = await userService.create(user)
            const { email } = createdUser
            const foundUser = await userService.findByEmail(email)
            expect(foundUser).toBeTruthy()
            expect(foundUser?.email).toEqual(email)
        })
    })
})