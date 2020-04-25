import AuthService from '../../src/services/auth.service'

const authService = new AuthService()

/**
 * AuthService test suite.
 */
describe('AuthService', () => {
    describe('create token', () => {
        /**
         * Test that a token can be created.
         */
        it('should create a token', async () => {
            const payload = { username: 'username' }
            const token = await authService.createToken(payload)
            expect(typeof token).toEqual('string')
        })
    })
})