const app = getApp()
const db = wx.cloud.database();

const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_arr:['全部订单','待收货','已完成'],
    select:'',
    openid:'',
    array:[],
    all:[],
    score: 0
  },

  // 确认收货
  ok(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var state = res.currentTarget.dataset.state;
    var array = [];
    var scoreList = 0;
    if(state == '待收货'){
      wx.cloud.callFunction({
        name:'updateOrder',
        data:{
          id:id,
          state:'已完成'
        },
        success(res){
          console.log("订单状态更新完成");
          db.collection('order')
          .get({
            success(res){
              for(var i = 0; i < res.data.length; i++){
                if(res.data[i]._openid == that.data.openid){
                  array.push(res.data[i])
                  scoreList += res.data[i].product[0].points
                }
                app.globalData.score = scoreList
                // console.log(scoreList);
                console.log('score', app.globalData.score);
                that.setData({
                  score: app.globalData.score
                })
                wx.setStorage({    //数据缓存方法
                  key: 'score',   //关键字，本地缓存中指定的key
                  data: app.globalData.score,    //缓存微信用户公开信息，
                  success: function() {      //缓存成功后，输出提示
                    console.log('写入score缓存成功')
                  },
                  fail: function() {        //缓存失败后的提示
                    console.log('写入score发生错误')
                  }
                })
              }
              // console.log('myOrder组件下的score', that.data.score);
              that.setData({
                array:array,
                all:array
              })
            }
          })
        },
        fail(res){
          console.log("更新失败",res);
        }
      })
    }
  },

  // 选择子页面
  select(res){
    var that = this;
    var state = res.currentTarget.dataset.state;
    var array = [];
    console.log(state);
    that.setData({
      select:state
    })
    if(state == '全部订单'){
      that.setData({
        array:that.data.all
      })
    }else {
      for(var i = 0; i < that.data.all.length; i++){
        if(that.data.all[i].state == state){
          array.push(that.data.all[i]);
        }
      }
      that.setData({
        array:array
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var array = [];
    var all = [];
    var allMoney = [];
    var name = options.name;
    // var score = app.globalData.score;
    // console.log(score);
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      select: name
    })
    console.log(that.data.select)
    wx.cloud.callFunction({
      name:'OpenId',
      success(res){
        that.setData({
          openid:res.result.openid
        })
        db.collection('order').get({
          success(res){
            wx.hideLoading({
              success: (res) => {},
            })
            for(var i = 0; i < res.data.length; i++){
              if(res.data[i]._openid == that.data.openid){
                all.push(res.data[i])
              }
            }
            that.setData({
              all:all
            })
            console.log("all",all);
            if(name == '全部订单'){
              that.setData({
                array:all
              })
            }else{
              for(var n = 0; n < all.length; n++){
                if(all[n].state == name){
                  array.push(all[n]);
                }
              }
              that.setData({
                array:array
              })
            }

            // for(var x = 0; x < array.length; x++){
            //   for(var y = 0; y < array[x].product[y].length; x++){

            //   }
            // }

          }
        })
      }
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