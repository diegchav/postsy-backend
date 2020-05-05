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
    name: 'Alex',
    password: 'password1234',
    email: 'alex@example.com'
}

const userExistingEmail = {
    name: 'NotAlex',
    password: 'password1234',
    email: 'alex@example.com'
}

const userMissingName = {
    password: 'password1234',
    email: 'alex@example.com'
}

const userMissingPassword = {
    name: 'Alex',
    email: 'alex@example.com'
}

const userMissingEmail = {
    name: 'Alex',
    password: 'password1234',
}

const userInvalidNameMaxLength = {
    name: new Array(121).fill('a').join(''),
    password: 'password1234',
    email: 'alex@example.com'
}

const userInvalidPasswordMinLength = {
    name: 'Alex',
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
         * Test that emails are unique.
         */
        it('should fail if an email already exists', async () => {
            expect(async () => {
                await expect(userService.create(userExistingEmail)).toThrow(MongoError)
            })
        })

        /**
         * Test user cannot be created if username is missing.
         */
        it('should fail if name is missing', async () => {
            await expect(userService.create(userMissingName)).rejects.toThrow(mongoose.Error)
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
         * Test user cannot be created if name length is greater than required.
         */
        it('should fail if name length is greater thatn required', async () => {
            await expect(userService.create(userInvalidNameMaxLength)).rejects.toThrow(mongoose.Error)
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
            const testUser = { name: 'Test', email: 'test@example.com', password: 'password' }
            const createdUser = await userService.create(testUser)
            const { email } = createdUser
            const foundUser = await userService.getByEmail(email)
            expect(foundUser).toBeTruthy()
            expect(foundUser?.email).toEqual(email)
        })
    })
})