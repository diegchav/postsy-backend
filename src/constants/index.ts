import path from 'path'

/**
 * API related.
 */
export const BASE_PATH = '/api'
export const AUTH_PATH = '/auth'
export const POSTS_PATH = '/posts'

/**
 * Mongo error codes.
 */
export const MONGO_DUP_KEY = 11000

/**
 * File uploads.
 */
export const UPLOADS_DIR = path.join(__dirname, '../..', 'public/uploads')