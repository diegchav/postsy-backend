/**
 * Returns the given string with the first letter in upper case.
 * 
 * @param s string to capitalize
 * @returns returns capitalized string
 */
export default (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}