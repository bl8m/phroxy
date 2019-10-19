const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class Call extends Model {}
Call.init({
  // attributes
  number: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },


}, {
  sequelize,
  modelName: 'call'
  // options
});


module.exports = Call;