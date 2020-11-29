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
 * @property {number} atomicCounter
 * @property {GroupEvents[]} events
 */

/**
 * @typedef {Object} GroupEvents
 * @property {string} id
 * @property {User} payeeUser
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {User[]} paidUsers
 */
