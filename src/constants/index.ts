import path from 'path'

/**
 * API related.
 */
export const BASE_PATH = '/api'
export const AUTH_PATH = '/auth'
export const POSTS_PATH = '/posts'
export const USERS_PATH = '/users'

/**
 * Mongo error codes.
 */
export const MONGO_DUP_KEY = 11000

/**
 * File uploads.
 */
export const UPLOADS_DIR = path.join(__dirname, '../..', 'public/uploads')
export const AWS_UPLOAD = process.env.AWS_UPLOAD === 'true' || false