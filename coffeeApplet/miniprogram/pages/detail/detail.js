const tools = require('../../utils/tools')
const db = wx.cloud.database()
const products = db.collection('products')
const cart = db.collection('cart')
const account = db.collection('account')
const order = db.collection('order')

import Toast from '../../vant-weapp/toast/toast'

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{}
  },
  
  /**
   * 自定义函数-加入购物车
   */
  addToCart:function(){
    let product = this.data.product

    //获取产品id
    cart.where({
      product_id:product._id
    }).get().then(res => {
      //已经存在
      if(res.data.length > 0){
        //更新购物车
        cart.doc(res.data[0]._id).update({
          data:{
            count:res.data[0].count + 1
          }
        }).then(res => {
          wx.showToast({
            title:'添加成功！',
          })
        })
      }
      //不存在
      else{
        product.product_id = product._id
        delete product._id
        delete product.sold
        delete product.storage
        product.count = 1
        //直接添加到购物车
        cart.add({
          data:product
        }).then(res => {
          wx.showToast({
            title:'添加成功！',
          })
        })
      }
    })
  },

  /**
   * 自定义函数-返回首页
   */
  goToHome:function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 自定义函数-购物车页面
   */
  goToCart:function(){
    wx.switchTab({
      url: '../cart/cart',
    })
  },

  /**
   * 自定义函数-立即购买当前商品
   */
  onClickButton:function(){
    //检查支付金额
    let price = this.data.product.price

    //提交按钮切换为加载状态
    this.setData({
      loading:true
    })

    //获取用户余额
    account.get().then(res => {
      let balance = 0,_id=''
      if(res.data.length != 0){
        balance = res.data[0].balance
        _id = res.data[0]._id
      }
      //余额不足
      if(balance < price){
        Toast.fail('余额不足')
        return
      }
      //余额足够
      //添加到订单去
      order.add({
        data:{
          drinks:[this.data.product],
          date:tools.getDate(),
          time:tools.getTime(),
          price:price
        }
      }).then(res => {
        Toast.success('购买成功');
        //更新余额
        account.doc(_id).update({
          data:{ balance:balance - price }
        }).then(res => {
          console.log(res)
          setTimeout(() => {
            //切换到个人中心页看余额
            wx.switchTab({
              url: '../my/my',
            })
          },500);
        },err => {
          console.log(err)
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id

    products.doc(id).get().then(res => {
      this.setData({
        product:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})