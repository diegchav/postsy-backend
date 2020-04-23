/**
 * Returns a more descriptive form of an express validation error.
 * 
 * @param error express validation error
 * @returns returns formatted error
 */
export const toJsonError = (error: any) => {
    return {
        [error.param]: error.msg
    }
}

/**
 * Returns the given string with the first letter in upper case.
 * 
 * @param s string to capitalize
 * @returns returns capitalized string
 */
export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}