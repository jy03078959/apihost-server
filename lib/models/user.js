var Sequelize = require('sequelize')
module.exports = function () {
  return {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    account: Sequelize.STRING
  }
};