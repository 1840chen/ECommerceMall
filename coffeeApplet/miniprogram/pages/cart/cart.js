// pages/cart/cart.js
import Toast from '../../vant-weapp/toast/toast'
import Dialog from '../../vant-weapp/dialog/dialog'
const db = wx.cloud.database()
const cart = db.collection('cart')
const tools = require('../../utils/tools')
const order = db.collection('order')
const account = db.collection('account')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    drinks:[],
    price:0,
    isSelectedAll:false,
    loading:false
  },

  /**
   * 自定义函数--监听数据变化
   */

  //更改购物车中的商品数量
  onChange(e){
    //console.log(e)
    //获取数组下标
    let i = e.currentTarget.dataset.index
    //获取商品数组
    let drinks = this.data.drinks

    Toast.loading({forbicClick:true});

    setTimeout(() => {
      Toast.clear();
      //更新云端购物车数据
      cart.doc(drinks[i]._id).update({
        data:{
          count:e.detail
        }
      }).then(res => {
        //更新数组
        drinks[i].count = e.detail

        //更新页面上的数据
        this.setData({
          drinks:drinks,
          price:tools.getPrice(drinks)
        })
      })
    },500);
  },

  /**
   * 自定义函数--删除购物车的商品
   */
  onClose(event){
    const{
      position,
      instance
    } = event.detail;
    switch(position){
      case 'left':
      case 'cell':
          instance.Close();
          break;
      case 'right':
          Dialog.confirm({
            message:'确定删除吗？',
            }).then(()=>{
              console.log(event)
              //获取产品id
              let id = event.currentTarget.dataset.id
              //删除数据
              cart.doc(id).remove().then(res => {
                this.getCart()
              })
            });
            break;
    }
  },

  //获取购物车内容
  getCart:function(){
    cart.get().then(res => {
      console.log(res.data)
      this.setData({
        drinks:res.data,
        price:tools.getPrice(res.data)
      })
    })
  },

  //切换商品选中状态
  changeSelect:function(e){
    //获取当前被选中商品的序号
    let i = e.currentTarget.dataset.index
    //获取当前是否全选
    let isSelectedAll = this.data.isSelectedAll
    //获取所有商品
    let drinks = this.data.drinks

    //如果是全选切换
    if(i == "selectAll"){
      isSelectedAll = !isSelectedAll

      //遍历所有商品，更新选中状态
      drinks.forEach(d => {
        d.checked = isSelectedAll
      })
    }
    //如果是单选切换
    else{
      //更新当前商品选中状态
      drinks[i].checked = !drinks[i].checked

      //检查是否需要切换全选按钮
      if(!drinks[i].checked){
        isSelectedAll = false
      }else{
        isSelectedAll = true
        for(let i = 0;i < drinks.length;i++){
          if(!drinks[i].checked){
            isSelectedAll = false
            break
          }
        }
      }
    }
    this.setData({
      drinks:drinks,
      isSelectedAll:isSelectedAll,
      price:tools.getPrice(drinks)
    })
  },

  /**
   * 自定义函数-提交购物车
   */
  onSubmit:function(e){
    //检查支付金额
    let price = this.data.price / 100
    //支付金额为0
    if(price == 0){
      Toast.fail('您没有选中任何商品')
      return
    }

    //提交按钮切换为加载状态
    this.setData({
      loading:true
    })
    //获取用户金额
    account.get().then(res=>{
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
      //筛选被选中的商品
      let drinks = this.data.drinks.filter(d=>{
        return d.checked == true
      })
      console.log(drinks)

      //添加到订单去
      order.add({
        data:{
          drinks:drinks,
          date:tools.getDate(),
          time:tools.getTime(),
          price:price
        }
      }).then(res => {
        Toast.success('购买成功');
        //更新余额
        account.doc(_id).update({
          data:{balance:balance - price}
        }).then(res=>{
          console.log(res)
        },err=>{
          console.log(err)
        })

        //调用云函数clearCart来批量删除
        wx.cloud.callFunction({
          name:'clearCart',
          data:{drinks:drinks},
          success:res => {
            console.log(res)
            this.setData({
              loading:false
            })
            //重新获取购物车内容
            this.getCart()
          }
        })
      })
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
    this.getCart()
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