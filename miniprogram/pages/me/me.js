const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isMember: '',
    score: 0
  },
  adminPwd(e) {
    var that = this;
    if(e.detail.value == '123456') {
      wx.showToast({
        title: '密码正确',
        success(res) {
          wx.navigateTo({
            url: '../admin/admin',
          })
          that.setData({
            show:!that.data.show
          })
        }
      })
    }
  },
  // 跳转到后台管理
  admin(){
    this.setData({
      show:!this.data.show
    })
  },
  // 跳转订单管理页
  toOrder(res){
    var name = res.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../myOrder/myOrder?name='+name,
    })
  },

  // 跳转我的收藏
  goToCollection(res){
    wx.redirectTo({
      url: '../myCollection/myCollection',
    })
  },

  // 跳转到会员页
  goToMember (res) {
    wx.redirectTo({
      url: '../member/member',
    })
  },

  // 跳转到积分商城
  goToPoints (res) {
    wx.redirectTo({
      url: '../points/points',
    })
  },

  // 跳转到分销中心
  toDistribute (res) {
    wx.redirectTo({
      url: '../distribute/distribute',
    })
  },

  shareProditTap () {
    wx.navigateTo({
        url: "../me/share/share"
    });
    },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isMember = app.globalData.isMember;
    var score = app.globalData.score;
    this.setData({
      isMember: isMember,
      score: score
    })
    console.log('me组件下的isMember', isMember);
    console.log('me组件下的score', score);
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