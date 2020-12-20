const tools = require('../../utils/tools')
const db = wx.cloud.database()
const account = db.collection('account')

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    myInfo:{
      avatarUrl:"/images/my/unlogin.png",
      nickName:'未知',
      balance:0

    }

  },

  onShow:function(){
    //调用公共函数tools.js文件中的getUserInfo获取授权信息
    tools.getUserInfo().then(userInfo => {
      //更新页面所需的参数信息
      this.setData({
        isLogin:true,
        myInfo:userInfo
      })
    })
  },

  /**
   * 自定义函数-登录
   */

  login:function (e) {
    //检查是否首次登录
    account.get({
      success:res=>{
        console.log(res)
        //获取用户信息
        let myInfo = e.detail.userInfo
        //是首次登录
        if(res.data.length == 0){
          //余额为0
          myInfo.balance = 0
          //创建账号
          account.add({
            data:myInfo
          })
        }
        //已经有账号了
        else{
          myInfo = res.data[0]
        }
        //更新用户信息
        this.setData({
          isLogin: true,
          myInfo: myInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //调用公共函数tools.js文件中的getUserInfo获取授权信息
    tools.getUserInfo().then(userInfo =>{
      //获取用户账户信息
      account.get({
        success:res => {
          //更新用户余额
          userInfo.balance = res.data[0].balance
          this.setData({
            isLogin:true,
            myInfo:userInfo
          })
        }
      })
    })
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

  },

  /**
   * 自定义函数-跳转订单页面
   */
  goToOrder:function(e){
    wx.navigateTo({
      url:'../order/order',
    })
  }

})