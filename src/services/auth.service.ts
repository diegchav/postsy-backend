import { sign } from 'jsonwebtoken'

class AuthService {
    private jwtSecret = process.env.JWT_SECRET || 'secret'
    private jwtOpts = {
        expiresIn: 60 * 60 // 1 hour
    }

    createToken = async (payload: any) => {
        const token = await sign(payload, this.jwtSecret, this.jwtOpts)
        return token
    }
}

export default AuthService