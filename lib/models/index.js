const fs = require('fs');
const config = require('config');
var Sequelize = require('sequelize')
var sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.hostname,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

//数据库连接测试
sequelize
.authenticate()
.then(function (err) {
  console.log('数据库连接成功');
})
.catch(function (err) {
  console.log('数据库连接失败:', err);
});

var Models = {}
const modelFiles = fs.readdirSync('./lib/models')
.filter(f => f !== 'index.js');
console.log(modelFiles)
modelFiles.forEach(file => {
  const table = file.split('.')[ 0 ];
  const modelFunc = require('./' + table);
  if (typeof modelFunc === 'function') {
    const modelName = table.charAt(0).toUpperCase() + table.slice(1);
    Models[ modelName ] = sequelize.define(table, modelFunc(), {
      'freezeTableName': true,
      'tableName': table
    });
  }
});
module.exports = Models;
