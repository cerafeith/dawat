function UnauthorizedException(message) {
  this.message = message;
  this.name = "UnauthorizedException";
}

// @ts-check
function UsersService(repo) {
  return {
    /**
     * @param {string} username
     * @param {string} password
     * @returns {User | null}
     */
    login(username, password) {
      const user = repo.getUserByUsername(username);
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
      repo.saveUser(username, password);
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
      repo.saveGroup(groupName, user);
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
  };
}

module.exports = {
  UsersService,
  GroupsService,
  UnauthorizedException,
};
