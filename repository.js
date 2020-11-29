// @ts-check
const { v4: uuidv4 } = require("uuid");

/**
 * @type {Group[]}
 */
let groups = [
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
    events: [],
  },
  {
    id: "testinghello",
    name: "My group 2",
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
    events: [],
  },
];

/**
 * @type {User[]}
 */
let users = [
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
    createUser(username, password) {
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
    /**
     * @param {string} name
     * @param {User} adminUser
     */
    createGroup(name, adminUser) {
      groups.push({
        id: uuidv4(),
        name,
        adminUserId: adminUser.id,
        users: [adminUser],
        events: [],
      });
    },
    /**
     * @param {Group} group
     */
    saveGroup(group) {
      groups = groups.map((existingGroup) => {
        if (existingGroup.id == group.id) {
          return group;
        }

        return existingGroup;
      });
    },
    /**
     * @param {number} userId
     */
    getUsersGroup(userId) {
      return groups.filter((group) =>
        group.users.map((v) => v.id).includes(userId)
      );
    },
  };
};
