const db = wx.cloud.database();
const util = require('../util.js');
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    shoucang:['../../icons/chosen-collection.png', '../../icons/collection.png'],
    id: '',
    openid:'',
    pinglun_value:''
  },

  // 获取评论的内容
  pinglun_value(res){
    console.log(res.detail.value);
    this.setData({
      pinglun_value:res.detail.value
    })
  },

  // 评论
  getuserinfo(res){
    var that = this;
    var id = that.data.array._id;
    var userName = '';
    var userImg = '';
    var time = util.formatTime(new Date());
    var neirong = that.data.pinglun_value;
    var pinglun = that.data.array.pinglun;
    wx.getUserProfile({
      desc:'获取用户信息',
      success(res) {
        userName = res.userInfo.nickName;
        userImg = res.userInfo.avatarUrl;
        var array = {
          neirong:neirong,time:time,userName:userName,userImg:userImg
        }
        pinglun.push(array);
        console.log(pinglun)
        wx.cloud.callFunction({
          name:'updatePingLun',
          data:{
            id:id,
            pinglun:pinglun
          },
          success(res){
            console.log("评论上传成功");
            wx.cloud.callFunction({
              name:'selectProduct',
              data:{
                id:id
              },
              success(res){
                console.log("最新内容为:",res.result.data);
                that.setData({
                  array:res.result.data[0],
                  pinglun_value:null
                })
              }
            })
          },
          fail(res){
            console.log("评论上传失败",res);
          }
        })
      }
    })
  },

  // 收藏
  shoucang(res){
    var that = this;
    var data = that.data.shoucang[1];
    var shoucang = that.data.shoucang;
    shoucang.pop();
    shoucang.unshift(data);
    that.setData({
      shoucang:shoucang
    })
    console.log(that.data.shoucang);
    if(that.data.shoucang[0] == '../../icons/collection.png'){
      db.collection('collection').add({
        data:{
          name:that.data.array.name,
          detail:that.data.array.detail,
          fenlei:that.data.array.fenlei,
          image:that.data.array.image,
          price:that.data.array.price,
          id:that.data.array._id
        },
        success(res){
          console.log("收藏成功",res);
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1500 //持续的时间
          })
        },
        fail(res){
          console.log("收藏失败",res);
        }
      })
    }else if(that.data.shoucang[0] == '../me/img/shoucang.png'){
      db.collection('collection').get({
        success(res){
          for(var i = 0; i < res.data.length; i++){
            if(res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id){
              wx.cloud.callFunction({
                name:'deleteCollection',
                data:{
                  id:res.data[i]._id
                },
                success(res){
                  console.log("删除成功");
                },
                fail(res){
                  console.log("删除收藏失败",res);
                }
              })
            }
          }
        }
      })
    }
  },

  // 加入购物车
  addToShopping(res){
    var that = this;
    var id = that.data.array._id;
    var array = that.data.array;
    var x = 0;
    db.collection('shopping_car').get({
      success(res){
        console.log(res);
        for(var i = 0; i < res.data.length; i++){
          if(res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id){
            wx.showToast({
              title: '您已重复添加',
            })
            x = 1;
          }
        }
        if(x == 0){
          db.collection('shopping_car').add({
            data:{
              name:array.name,
              price:array.price,
              detail:array.detail,
              image:array.image,
              checked:true,
              num:1,
              id:array._id,
              points: array.points
            },
            success(res){
              console.log("上传成功");
              wx.showToast({
                title: '成功加入购物车',
              })
            },
            fail(res){
              console.log("上传失败",res);
            }
          })
        }
      }
    })
  },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage (res) {
      var that = this;
      //如果用户是点击按钮进行分享的
      if (res.from == 'button') {
        return {
          title: that.data.title, //分享出去的标题
          imageUrl: that.data.imgUrl, //分享时显示的图片
          path: "pages/index/index?id=" + id //别人点击链接进来的页面及传递的参数
        }
      } else {
        return {
          title: that.data.title, //分享出去的标题
          imageUrl: that.data.imgUrl, //分享时显示的图片
          path: "pages/index/index?id=" + id //别人点击链接进来的页面及传递的参数
        }
      }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    this.setData({
      id: id
    })
    wx.showLoading({
      title: '加载中',
    })
    // console.log(id);
    db.collection('product_shopping').doc(id)
    .get({
      success (res) {
        that.setData({
          array: res.data
        })
      }
    })
    
    wx.cloud.callFunction({
        name:'OpenId',
        success (res) {
          that.setData({
            openid: res.result.openid
          })
          db.collection('collection').where({
            price: _.lt(10000)
          }).get({
            success(res){
              wx.hideLoading({
                success: (res) => {},
              })
              for(var i = 0; i < res.data.length; i++){
                if(res.data[i]._openid == that.data.openid && res.data[i].id == that.data.array._id){
                  var data = that.data.shoucang[1];
                  var shoucang = that.data.shoucang;
                  shoucang.pop();
                  shoucang.unshift(data);
                  that.setData({
                    shoucang:shoucang
                  })
                }
              }
            }
          })
        }
    })

    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
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