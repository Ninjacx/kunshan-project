const {sequelizeDB} = require('../SequelizeDb');
const {Sequelize,DataTypes,Model,QueryTypes} = require('sequelize');

const Order = sequelizeDB.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true   // 自动递增
  },
  all_amount: {
    type: DataTypes.STRING,
  },
  customer_name: {
    type: DataTypes.STRING,
  },
  customer_addr: {
    type: DataTypes.STRING,
  },
  customer_contact: {
    type: DataTypes.STRING,
  },
  remark:{
    type: DataTypes.INTEGER,
  },
  create_time: {
    type: DataTypes.DATE,
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
  tableName: 't_order',
  sequelizeDB, // 我们需要传递连接实例
  modelName: 'Order' // 我们需要选择模型名称
});
exports.OrderModel = Order;