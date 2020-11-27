/**
 * 
 * @param {*} req 
 */
module.exports.NewContext = function (req) {
  return {
    userId: req.session.userId,
  };
};
