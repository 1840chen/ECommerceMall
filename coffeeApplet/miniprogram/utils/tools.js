function getUserInfo(){
  return new Promise((resolve,reject) =>{
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']===false){
          //已拒绝授权
          reject()
        }else{
          wx.getUserInfo({
            success(res){
              const userInfo = res.userInfo
              resolve(userInfo)
            }
          })
        }
      }
    })
  })
}

module.exports = {
  getUserInfo:getUserInfo
}

//获取商品总价
function getPrice(drinks){
  let price = 0
  drinks.forEach(d=>{
    if(d.checked){
      price += d.price * d.count
    }
  })
  return price * 100
}

module.exports = {
  getUserInfo:getUserInfo,
  getPrice:getPrice
}

function getDate(){
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth()+1;
  var d = now.getDate();

  if(m<10)m='0'+m;
  if(d<10)d='0'+d;

  return y+'-'+m+'-'+d;
}

function getTime(){
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  if(h<10)h='0'+h
  if(m<10)m='0'+m;
  if(s<10)s='0'+s;

  return h+':'+m+':'+s;
}

//暴露函数
module.exports = {
  getUserInfo:getUserInfo,
  getDate:getDate,
  getTime:getTime,
  getPrice:getPrice
}