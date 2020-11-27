// @ts-check

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} [password]
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {number} adminUserId,
 * @property {User[]} users
 */