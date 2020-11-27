// @ts-check
module.exports.UsersService = function (repo) {
  return {
    /**
     * @param {string} username
     * @param {string} password
     * @returns {boolean}
     */
    login(username, password) {
      const user = repo.getUserByUsername(username);
      return user.password === password;
    },
    /**
     * @param {string} username 
     * @param {string} password 
     */
    registerUser(username, password) { 
      repo.saveUser(username, password);
    }
  };
};

module.exports.GroupsService = function (repo) {};
