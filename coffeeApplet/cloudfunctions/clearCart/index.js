// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cart = db.collection('cart')
const_= db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //获取商品数组
  let drinks = event.drinks
  //获取商品编号
  let idArr = []
  drinks.forEach(d=>{
    idArr.push(d._id)
  })
  //批量查询和删除
  await cart.where({
    _id:_.in(idArr)
  }).remove()
}