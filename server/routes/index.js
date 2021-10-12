var express = require('express');
// DATE_FORMAT(t_user.create_time,"%Y-%m-%d")as createTime
var conf = require('../conf/conf');
var {successResult, setCatch} = require('../common/publicFn');
const serverIp = require('../common/serverIp');

const weChatCheckLogin = require('./weChatCheckLogin');
const {sequelizeDB} = require('../conf/SequelizeDb');
const {Sequelize, Op, DataTypes, Model, QueryTypes} = require('sequelize');
const axios = require('axios');
var wxBizDataCrypt = require('../common/WXBizDataCrypt');
// var {MenuModel} = require('../conf/model/t_menu');
var {TypeModel} = require('../conf/model/t_type');
var {OrderModel} = require('../conf/model/t_order');
var {OrderDetailModel} = require('../conf/model/t_order_detail');

var url = require('url');
// const fs = require('fs');//文件
// const multer = require('multer')({ dest: 'www/upload' });
// var bodyParser = require('body-parser');//post请求用
var staticPath = require('express-static');//post请求用
var router = express.Router();
var app = express();
var formidable = require("formidable");
var fs = require('fs');//文件
const uuid_v5 = require('uuid/v5');
const uuid_v4 = require('uuid/v4');


// const AuthMiddleware = require('./checklogin');
const checklogin = require('./checklogin');
const {resultError, paramsRule, paramsInit, initWhereParams, setTimeStamp, deepJson, getNowDate} = require('../common/tools');

/* 添加单个品类 */
router.post('/addType', (req, res, next) => {
	var { type_name, type_code, amount } = req.body
	TypeModel.create({ type_name, amount, type_code }).then((result)=>{
    successResult(res, result._options, '添加品类成功')
  }).catch((error)=>{
    console.log('error',error);
      setCatch(res, error)
  })
});
/* 删除单个品类 */
router.post('/delTypeOne', (req, res, next) => {
	var { type_id } = req.body
  TypeModel.update({is_del: 1}, {
    where: {
      id: paramsRule(type_id),
    }
  }).then((result)=>{
    successResult(res, result, '删除成功')
  }).catch((error)=>{
    console.log('error', error);
      setCatch(res, error)
  })
});

// 获取品类，用于下拉
router.get('/getTypeAll',async (req, res, next)=>{
  TypeModel.findAll({
    where: initWhereParams(),
    order: [
      ['create_time', 'DESC']
    ],
		attributes: ['id', 'type_name','amount']
	}).then((result)=>{
		successResult(res, result)
	}).catch((error)=>{
			setCatch(res, error)
	})
})

/*获取品类*/
router.get('/getTypeList',async (req, res, next)=>{
	const { pageSize ,limit, searchKey, searchValue} = req.query
  var limits = limit || 20
  var offset = (pageSize - 1) * limits
  
  console.log(searchKey, searchValue);
  
  // 查询分页总数
  const allCount =await TypeModel.count({
    where: initWhereParams(
      {
        type_name: {
          [Op.like]: '%'+searchValue+'%'
        }
      }
    )
  });
	TypeModel.findAll({
    where: initWhereParams(
      {
        type_name: {
          [Op.like]: '%'+searchValue+'%'
        }
      }
    ),
    order: [
      ['create_time', 'DESC']
    ],
		attributes: ['id', 'type_name','type_code', 'amount'],
		offset: offset,
		limit: Number(limits),
	}).then((result)=>{
    var resObj = Object.assign({data: deepJson(result)},{allCount})
		successRes(res, resObj)
	}).catch((error)=>{
			setCatch(res, error)
	})
});


/* 添加单条订单 */
router.post('/addOrder',async (req, res, next) => {
	var { all_amount, remark, customer_name, customer_addr, customer_contact, typeContList } = req.body
  // var {typeContList} = req.body
	const isSucOrder = await OrderModel.create({ all_amount, remark, customer_name, customer_addr, customer_contact }).catch((error)=>{
      setCatch(res, error)
  })
  if(deepJson(isSucOrder).id){
    var arrParams = typeContList.map((item)=>{
      return {
        ...item,
        order_id: deepJson(isSucOrder).id
      }
    })
    console.log('typeContList', arrParams);
    OrderDetailModel.bulkCreate(arrParams).then((result)=>{
        successResult(res, result, '新增订单成功')
      }).catch((error)=>{
          setCatch(res, error)
      })
  }
});


/* 删除单条订单 */
router.post('/delOrderOne', (req, res, next) => {
	var { order_id } = req.body
  OrderModel.update({is_del: 1}, {
    where: {
      id: paramsRule(order_id),
    }
  }).then((result)=>{
    successResult(res, result, '删除成功')
  }).catch((error)=>{
    console.log('error', error);
      setCatch(res, error)
  })
});

router.get('/', function(req, res, next) {
res.render('dist/index', { hidden: 1});
//	var deviceAgent = req.headers["user-agent"].toLowerCase();
//    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
//    if(agentID){
//        res.sendFile(`${process.cwd()}/public/index.html`, {title:''});
//    }else{
//		req.session.page = '/';
 //       res.render('dist/index', { hidden: 1});
 //   }
});

// 获取订单列表
router.get('/getOrderList',async (req, res, next)=>{
	const { pageSize, limit, searchKey, searchValue} = req.query
  var limits = limit || 20
  var offset = (pageSize - 1) * limits
  OrderDetailModel.hasOne(OrderModel, {foreignKey: 'order_id' })
  OrderModel.belongsTo(OrderDetailModel, {foreignKey: 'id'}) 

  // 查询分页总数
  const allCount = await OrderModel.count({
    where: initWhereParams(),
  });
  OrderModel.findAll({
      group: 'order_id',
      order: [
        ['create_time', 'DESC']
      ],
      attributes: {
        include:[
          [Sequelize.fn('date_format', Sequelize.col('Order.create_time'),'%Y-%m-%d %H:%i:%s'), 'order_create_time'],
					// Sequelize.col('Order.all_amount'),
          // Sequelize.col('Order.customer_name'),
          // Sequelize.col('Order.customer_addr'),
          // Sequelize.col('Order.customer_contact'),
          Sequelize.col('Order.id'),
        ],
        exclude: ['create_time','order_id','OrderDetail.*'] 
      },
      where: initWhereParams(),
			offset: offset,
			limit: Number(limits),
      // where: {uid, is_lease: paramsRule(lease)}, 
      include: [
                { model: OrderDetailModel,
                  where: initWhereParams(),
                  attributes: [],
                  required: false,
                },
      ], raw: true}).then((result)=>{
        var resObj = Object.assign({data: deepJson(result)},{allCount})
        successRes(res, resObj)
      }).catch((error)=>{
        setCatch(res, error)
      })
});

/***********详情*************/
// 获取订单详情品类与数量列表
router.get('/getOrderDetailTypeList',async (req, res, next)=>{
  var { order_id } = req.query
  TypeModel.hasOne(OrderDetailModel, {foreignKey: 'id'})
  OrderDetailModel.belongsTo(TypeModel, {foreignKey: 'type_id'}) 
  OrderDetailModel.findAll({
      attributes: {
        include:[
          // [Sequelize.fn('date_format', Sequelize.col('Order.create_time'),'%Y-%m-%d %H:%i:%s'), 'order_create_time'],
          Sequelize.col('type_name'),
	  Sequelize.col('amount'),
 	  Sequelize.col('type_code'),
        ],
        exclude: ['create_time','is_del'] 
      },
      where: initWhereParams({order_id: order_id}),
      // where: {uid, is_lease: paramsRule(lease)}, 
      include: [
                { model: TypeModel,
                  attributes: [],
                  required: false,
                },
      ], raw: true}).then((result)=>{
        successResult(res, result)
      }).catch((error)=>{
        setCatch(res, error)
      })
});

// 获取订单详情基本信息
router.get('/getOrderDetail',async (req, res, next)=>{
	const { order_id } = req.query
  // TypeModel.hasOne(OrderModel, {foreignKey: 'id'})
  // OrderModel.belongsTo(TypeModel, {foreignKey: 'type_id'})
  OrderDetailModel.hasOne(OrderModel, {foreignKey: 'order_id'})
  OrderModel.belongsTo(OrderDetailModel, {foreignKey: 'id'}) 

  OrderModel.findOne({
      attributes: {
        include:[
          [Sequelize.fn('date_format', Sequelize.col('Order.create_time'),'%Y-%m-%d %H:%i:%s'), 'order_create_time'],
					Sequelize.col('Order.all_amount'),
          Sequelize.col('Order.customer_name'),
          Sequelize.col('Order.customer_addr'),
          Sequelize.col('Order.customer_contact'),
          Sequelize.col('Order.id'),
          // Sequelize.col('amount'),
        ],
        // 'id', 'create_time',
        exclude: ['order_id'] 
      },
      where: initWhereParams({id: paramsRule(order_id)}),
      include: [
                { model: OrderDetailModel,
                  where: initWhereParams(),
                  attributes: [],
                  required: false,
                },
      ], raw: true}).then((result)=>{
        successResult(res, result)
      }).catch((error)=>{
        setCatch(res, error)
      })
});

// 更新订单详情
router.post('/updateOrderDetail',async (req, res, next) => {
  // console.log('req', req.body);
  var {id, all_amount, customer_name, customer_contact, customer_addr, remark, orderDetailTypeList} = req.body
  // console.log('orderDetailTypeList', orderDetailTypeList);
  var updateDetailList = []
  var creatDetailList = []
  if(orderDetailTypeList.length){
    orderDetailTypeList.forEach(element => {
      console.log('element', element.id);
      if(element.id){
        updateDetailList.push({id: element.id, type_id: element.type_id, count: element.count})
      }else{
        creatDetailList.push({order_id: id, type_id: element.type_id, count: element.count})
      }
    });
  }
  // return false
  // 启用事务 失败则回滚
  await sequelizeDB.transaction((t) => {
    return Promise.all([
      OrderModel.update({all_amount, customer_name, customer_contact, customer_addr, remark},{where: {id: paramsRule(id)}}, {transaction: t}),
      OrderDetailModel.bulkCreate(creatDetailList, {transaction: t}),
      OrderDetailModel.bulkCreate(updateDetailList,{updateOnDuplicate:["type_id","count"]}, {transaction: t}),
    ])
  }).then((result,j)=>{ 
    successResult(res, result, '更新成功')
  }).catch((error)=>{
    console.log(error);
    setCatch(res, error)
  })
})

/* 删除单条订单品类 */
router.post('/delOrderDetailTypeOne', (req, res, next) => {
	var { orderDetail_id } = req.body
  OrderDetailModel.destroy({
    where: {
      id: paramsRule(orderDetail_id),
    }
  }).then((result)=>{
    successResult(res, result, '删除成功')
    // successResult(res, result)
  }).catch((error)=>{
    setCatch(res, error)
  })
});

module.exports = router;
