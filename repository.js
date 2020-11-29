// @ts-check
const { addDays, subDays } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

/**
 * @type {Group[]}
 */
let groups = [
  {
    id: "XXXXXX-XXXX-XXXX",
    name: "Group 1",
    adminUserId: 3,
    atomicCounter: 0,
    users: [
      {
        id: 3,
        username: "admin",
        groupJoinDate: new Date(2020, 6, 6),
      },
      {
        id: 2,
        username: "user2",
        groupJoinDate: new Date(2020, 6, 6),
      },
      {
        id: 1,
        username: "user1",
        groupJoinDate: new Date(2020, 6, 5),
      },
    ],
    events: [],
  },
  {
    id: "testinghello",
    name: "Group 2",
    adminUserId: 1,
    atomicCounter: 0,
    users: [
      {
        id: 3,
        username: "admin",
        groupJoinDate: new Date(2020, 6, 6),
      },
      {
        id: 2,
        username: "user2",
        groupJoinDate: new Date(2020, 6, 6),
      },
      {
        id: 1,
        username: "user1",
        groupJoinDate: new Date(2020, 6, 5),
      },
    ],
    events: [
      {
        id: uuidv4(),
        endDate: addDays(new Date(), 5),
        startDate: subDays(new Date(), 5),
        paidUsers: [],
        payeeUser: {
          id: 3,
          username: "admin",
        },
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
    groupJoinDate: new Date(2020, 6, 6),
  },
  {
    id: 2,
    username: "user2",
    password: "user2",
    groupJoinDate: new Date(2020, 6, 6),
  },
  {
    id: 1,
    username: "user1",
    password: "admin",
    groupJoinDate: new Date(2020, 6, 6),
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
        atomicCounter: 0,
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
