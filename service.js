// @ts-check
const { addDays, isWithinInterval } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

function UnauthorizedException(message) {
  this.message = message;
  this.name = "UnauthorizedException";
}

function InvalidArgumentException(message) {
  this.message = message;
  this.name = "InvalidArgumentException";
}

function UsersService(repo) {
  return {
    /**
     * @param {string} username
     * @param {string} password
     * @returns {User | null}
     */
    login(username, password) {
      const user = repo.getUserByUsername(username);
      // TODO: Implement password hashing
      if (user.password === password) {
        return user;
      }

      return null;
    },
    /**
     * @param {string} username
     * @param {string} password
     */
    registerUser(username, password) {
      repo.createUser(username, password);
    },
  };
}

function GroupsService(repo) {
  return {
    /**
     * @param {string} groupId
     * @returns {string}
     */
    inviteLink(groupId) {
      return "http://localhost:3000/invite/" + groupId;
    },
    /**
     * @param {number} userId
     */
    getUsersGroup(userId) {
      return repo.getUsersGroup(userId);
    },
    /**
     * @param {string} userId
     * @param {string} groupName
     */
    createGroup(userId, groupName) {
      const user = repo.getUserById(userId);
      repo.createGroup(groupName, user);
    },
    /**
     *
     * @param {string} userId
     * @param {string} groupId
     * @returns {Group}
     * @throws {UnauthorizedException}
     */
    getGroup(userId, groupId) {
      const group = repo.getGroupById(groupId);
      if (!group.users.map((v) => v.id).includes(userId)) {
        throw new UnauthorizedException(
          `getGroup by userId: ${userId} not authorized to view group`
        );
      }

      return group;
    },
    /**
     *
     * @param {string} groupId
     * @returns {Group}
     */
    getGroupById(groupId) {
      return repo.getGroupById(groupId);
    },
    /**
     * @param {Group} group
     * @param {Date} date
     * @returns {GroupEvents | null}
     */
    getRecentEventByDate(group, date) {
      if (group.events.length === 0) {
        return null;
      }

      const [event] = group.events;

      if (
        isWithinInterval(date, {
          start: event.startDate,
          end: event.endDate,
        })
      ) {
        return event;
      }

      return null;
    },
    /**
     * @param {string} userId
     * @param {string} groupId
     * @param {number} numberOfDays
     */
    createNewEvent(userId, groupId, numberOfDays) {
      const group = repo.getGroupById(groupId);
      if (!group.users.map((v) => v.id).includes(userId)) {
        throw new UnauthorizedException(
          `createNewEvent by userId: ${userId} not authorized to view group`
        );
      }

      const userClone = [...group.users];

      userClone.sort((a, b) => (a.groupJoinDate > b.groupJoinDate ? 0 : -1));

      const payeeUser = userClone[group.atomicCounter % userClone.length];

      const modifiedGroup = {
        ...group,
        events: [
          ...group.events,
          {
            id: uuidv4(),
            startDate: new Date(),
            endDate: addDays(new Date(), numberOfDays),
            paidUsers: [],
            payeeUser,
          },
        ],
        atomicCounter: group.atomicCounter + 1,
      };

      repo.saveGroup(modifiedGroup);
    },
    /**
     *
     * @param {number} userId
     * @param {string} groupId
     */
    addUserToGroup(userId, groupId) {
      const user = repo.getUserById(userId);
      const group = repo.getGroupById(groupId);

      if (group.users.map((v) => v.id).includes(userId)) {
        throw new InvalidArgumentException(
          `User ${user.username} is already a member of ${group.name}`
        );
      }

      const modifiedGroup = {
        ...group,
        users: [...group.users, { ...user, groupJoinDate: new Date() }],
      };
      repo.saveGroup(modifiedGroup);
    },
    /**
     * @param {number} userId id of the user that has paid
     * @param {string} groupId id of the group
     * @param {string} eventId id of the event
     */
    addPaidUser(userId, groupId, eventId) {
      /**
       * @type {Group}
       */
      const group = repo.getGroupById(groupId);
      if (!group.users.map((v) => v.id).includes(userId)) {
        throw new UnauthorizedException(
          `addPaidUser by userId: ${userId} not authorized to view group`
        );
      }

      /**
       * @type {User}
       */
      const user = repo.getUserById(userId);

      const modifiedGroup = {
        ...group,
        events: group.events.map((existingEvent) => {
          if (existingEvent.id == eventId) {
            return {
              ...existingEvent,
              paidUsers: [...existingEvent.paidUsers, user],
            };
          }

          return existingEvent;
        }),
      };

      repo.saveGroup(modifiedGroup);
    },
    /**
     *
     * @param {number} userId
     * @param {string} groupId
     * @param {string} eventId
     */
    removePaidUser(userId, groupId, eventId) {
      /**
       * @type {Group}
       */
      const group = repo.getGroupById(groupId);
      if (!group.users.map((v) => v.id).includes(userId)) {
        throw new UnauthorizedException(
          `addPaidUser by userId: ${userId} not authorized to view group`
        );
      }

      const modifiedGroup = {
        ...group,
        events: group.events.map((existingEvent) => {
          if (existingEvent.id == eventId) {
            const modifiedPaidUsers = existingEvent.paidUsers.filter(
              (removeUser) => removeUser.id != userId
            );
            return {
              ...existingEvent,
              paidUsers: modifiedPaidUsers,
            };
          }

          return existingEvent;
        }),
      };

      repo.saveGroup(modifiedGroup);
    },
  };
}

module.exports = {
  UsersService,
  GroupsService,
  UnauthorizedException,
  InvalidArgumentException,
};
