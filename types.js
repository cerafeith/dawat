// @ts-check

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} [password]
 * @property {Date} [groupJoinDate] Date of which the user joined the group
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {number} adminUserId,
 * @property {User[]} users
 * @property {number} atomicCounter A counter that gets incremented everytime a new event is created
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
