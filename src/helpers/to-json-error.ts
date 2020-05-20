/**
 * Returns a more descriptive form of an express validation error.
 * 
 * @param error express validation error
 * @returns returns formatted error
 */
export default (error: any) => {
    return {
        [error.param]: error.msg
    }
}