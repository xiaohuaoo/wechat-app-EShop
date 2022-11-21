const util = require('../util.js');
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productName: '',
    productDesc: '',
    productPrice: '',
    productFenlei: '',
    fileID:'',
    now:'',
    array:[]
  },

  getName (e) {
    console.log(e);
    this.setData({
      productName: e.detail
    })
  },

  // 获取商品名称的输入
  getProductName(res){
    this.setData({
      productName: res.detail
    })
  },

  // 获取商品描述信息的输入
  getProductDesc(res){
    this.setData({
      productDesc: res.detail
    })
  },

  // 获取商品类别的输入
  getProductFenlei(res){
    this.setData({
      productFenlei: res.detail
    })
  },

  // 获取商品单价的输入
  getProductPrice(res){
    this.setData({
      productPrice: res.detail
    })
  },

  getPicture(res){
    var that = this;
    var num = Math.floor(Math.random()*10000);
    var time = Date.parse(new Date());
    wx.chooseImage({
      count: 1,
      success(res){
        console.log(res);
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          cloudPath:'shop/' + time + '-' + num,
          filePath:res.tempFilePaths[0],
          success(res){
            console.log("上传成功",res);
            that.setData({
              fileID:res.fileID
            })
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail(res){
            console.log("上传失败",res);
          }
        })
      }
    })
  },
  submit(res){
    var that = this;
    console.log(that.data.productName,that.data.productDesc,that.data.productFenLei,that.data.productPrice);
    if(that.data.productName == '' || that.data.productDesc == '' || that.data.productFenLei == '' || that.data.productPrice == ''){
      wx.showToast({
        title: '请完整填写信息',
      })
    }else{
      if(that.data.now == '修改'){
        wx.cloud.callFunction({
          name:'updateProduct',
          data:{
            id:that.data.array._id,
            name:that.data.productName,
            fenlei:that.data.productFenLei,
            desc:that.data.productDesc,
            price:that.data.productPrice,
            image: that.data.fileID
          },
          success(res){
            console.log("信息修改成功");
            wx.redirectTo({
              url: '../admin/admin',
              success(res){
                wx.showToast({
                  title: '修改成功',
                  duration:3000
                })
              }
            })
          },
          fail(res){
            console.log("信息修改失败",res);
          }
        })
      }else{
        db.collection('product_shopping').add({
          data:{
            id:that.data.array._id,
            name:that.data.productName,
            fenlei:that.data.productFenLei,
            desc:that.data.productDesc,
            price:that.data.productPrice
          },
          success(res){
            console.log("上传成功");
            wx.showToast({
              title: '上传成功',
              success(res){
                wx.redirectTo({
                  url: '../admin/admin',
                })
              }
            })
          }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(decodeURIComponent(options.data));
    if(decodeURIComponent(options.data) == undefined){
      console.log('传过来的数据', 'undefined');
    }else{
      var array = JSON.parse(decodeURIComponent(options.data));
      console.log(array);
      that.setData({
        fenlei:array.fenlei,
        now:'修改',
        name:that.data.productName,
        fenlei:that.data.productFenLei,
        desc:that.data.productDesc,
        price:that.data.productPrice,
        fileID:array.image,
        array:array
      })
    }
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