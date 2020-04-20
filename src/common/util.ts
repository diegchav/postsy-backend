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