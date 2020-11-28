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
    /**
     *
     * @param {string} name
     * @param {User} adminUser
     */
    saveGroup(name, adminUser) {
      groups.push({
        id: uuidv4(),
        name,
        adminUserId: adminUser.id,
        users: [adminUser],
      });
    },
    /**
     * @param {Group} group
     * @param {User} user
     * @returns {Group}
     */
    addUserToGroup(group, user) {
      const modifiedGroup = {
        ...group,
        users: [...group.users, user],
      };

      groups = groups.map((existingGroup) => {
        if (existingGroup.id == group.id) {
          return modifiedGroup;
        }

        return existingGroup;
      });

      return modifiedGroup;
    },
    /**
     *
     * @param {number} userId
     */
    getUsersGroup(userId) {
      return groups.filter((group) =>
        group.users.map((v) => v.id).includes(userId)
      );
    },
  };
};
