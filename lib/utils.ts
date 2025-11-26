/**
 * Generate a random alphanumeric string of a specific length (6-7)
 * Rule: [A-Za-z0-9]
 * @param length
 * @returns generated short code
 */

export function generateShortCode(length: number = 7): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validates if a string is a valid URL.
 * Use the installed 'is-url' library.
 */
import isUrl from "is-url";
export { isUrl };
