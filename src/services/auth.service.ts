import { sign, verify } from 'jsonwebtoken'

import TokenValidationException from '../exceptions/token-validation-exception'

interface TokenPayload {
    _id: string
}

class AuthService {
    private jwtSecret = process.env.JWT_SECRET || 'secret'
    private jwtOpts = {
        expiresIn: 60 * 60 // 1 hour
    }

    createToken = async (payload: TokenPayload) => {
        const token = await sign(payload, this.jwtSecret, this.jwtOpts)
        return token
    }

    verifyToken = async (token: string) => {
        try {
            const payload = await verify(token, this.jwtSecret) as TokenPayload
            return payload._id
        } catch (err) {
            throw new TokenValidationException()
        }
    }
}

export default AuthService