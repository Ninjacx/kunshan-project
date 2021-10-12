const {sequelizeDB} = require('../SequelizeDb');
const {Sequelize,DataTypes,Model,QueryTypes} = require('sequelize');

const Type = sequelizeDB.define('Type', {
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
    // allowNull: false
  },
  type_name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  type_code: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  amount: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  is_del: {
    type: DataTypes.INTEGER
    // allowNull 默认为 true
  }
}, {
  // 这是其他模型参数
  freezeTableName: true, // 禁止模型名根据表名自动复数
  timestamps: true,

  // 不需要字段
  createdAt: false,
  updatedAt: false,
  tableName: 't_type',
  sequelizeDB, // 我们需要传递连接实例
  modelName: 'Type' // 我们需要选择模型名称
});

exports.TypeModel = Type;
// Collect
