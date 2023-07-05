/**
 * Defines a REGEX to remove all special chars both leading and trailing
 */
const LEADING_TRAILING_SPECIAL_CHARS_REGEX =
  // eslint-disable-next-line no-useless-escape
  /(^| +)[!-\/:-@\[-`\{-~]*([^ ]*?)[!-\/:-@\[-`\{-~]*(?=\s|$)/gi;

/**
 * Trim special chars from a string
 * @param {*} str String to remove chars from
 * @returns A string with no leading nor trailing special chars
 */
export function trimSpecialChars(str) {
  return str.replace(LEADING_TRAILING_SPECIAL_CHARS_REGEX, '$1$2');
}
