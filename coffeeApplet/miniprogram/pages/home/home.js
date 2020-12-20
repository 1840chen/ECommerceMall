const db = wx.cloud.database()
const products = db.collection('products')

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'s',
    activeKey:0,
    banner:[
      "/images/banner/1.jpg",
      "/images/banner/2.jpg",
      "/images/banner/3.jpg",
      "/images/banner/4.jpg",
    ],
      drinks:[
        
      ]

  },

  getDrinks:function(){
    products.get().then(res=>{
      console.log(res.data)
      this.setData({
        drinks:res.data
      })
    })
  },

  onChange(event){
    //从0开始计数
    let i = parseInt(event.detail)
    let t = '未知'
    if (i == 0) t = 'f'
    else if (i == 1) t = 's'
    else if (i == 2) t = 'm'
    else if (i == 3) t = 'c'


    console.log(t)


    this.setData({
      type:t
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
    this.getDrinks()
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