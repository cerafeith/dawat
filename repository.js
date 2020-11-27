// @ts-check

/**
 * @type {Group[]}
 */
const groups = [
  {
    id: "XXXXXX-XXXX-XXXX",
    name: "My group name",
    adminUserId: 3,
    users: [
      {
        id: 3,
        username: "admin",
      },
      {
        id: 2,
        username: "user2",
      },
      {
        id: 1,
        username: "user1",
      },
    ],
  },
];

/**
 * @type {User[]}
 */
const users = [
  {
    id: 3,
    username: "admin",
    password: "admin",
  },
  {
    id: 2,
    username: "user2",
    password: "user2",
  },
  {
    id: 1,
    username: "user1",
    password: "admin",
  },
];

module.exports.InMemory = function (db) {
  return {
    /**
     * @param {string} username
     * @param {string} password
     */
    saveUser(username, password) {
      users.push({ id: users.length + 1, username, password });
    },
    /**
     * @param {number} id
     * @returns {User}
     */
    getUserById(id) {
      return users.find((u) => u.id == id);
    },
    /**
     *
     * @param {string} username
     */
    getUserByUsername(username) {
      return users.find((u) => u.username == username);
    },
    /**
     * @param {string} id
     * @returns {Group}
     */
    getGroupById(id) {
      return groups.find((g) => g.id == id);
    },
  };
};
