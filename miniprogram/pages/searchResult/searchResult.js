// pages/searchResult/searchResult.js
const App = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    // 自定义顶部导航
    navHeight: App.globalData.navHeight,
    navTop: App.globalData.navTop,
    // 图标
    leftIcon: "https://ico.dongtiyan.com/tu-130.png",
    searchIcon: "https://ico.dongtiyan.com/tu-99.png",
    historyStorage: [],        //历史搜索
    historyStorageShow: false,
    hotsearch1: [{ title: "女装" }, { title: "美妆" }, { title: "女鞋" }, { title: "数码产品" }, { title: "其它" }],
    inputValue: "",        //输入框输入的值
    replaceValue: "",     //替换输入框的值
    eye: true,        //显示隐藏
    searchresult: false
  },
  // 点击返回上一级
  goBack: function () {
    // let pages = getCurrentPages();      //获取小程序页面栈
    // let beforePage = pages[pages.length - 2];       //获取上个页面的实例对象
    // beforePage.setData({
    //   txt: "修改数据了"
    // })
    // beforePage.goUpdate();           //触发上个页面自定义的go_update()方法
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 获取顶部固定高度
   */
  attached: function () {
    this.setData({
      navHeight: App.globalData.navHeight,
      navTop: App.globalData.navTop,
    })
  },
 
  /**
   * 热门搜索显示隐藏
   */
  reye: function () {
    this.setData({
      eye: !this.data.eye
    })
  },
 
  /**
   * 清除
   */
  remove: function () {
    var _this = this
    wx: wx.showModal({
      content: '确认清除所有历史记录?',
      success: function (res) {
        if (res.confirm) {
          wx: wx.removeStorage({
            key: 'historyStorage',
            success: function (res) {
              _this.setData({
                historyStorage: []
              })
              wx.setStorageSync("historyStorage", [])
            },
          })
        } else {
          console.log("点击取消")
        }
      },
    })
  },
 
 
  /**
   * 获取input的值
   */
  getInputValue(e) {
    // console.log("获取到了", e.currentTarget.dataset.value)
    // console.log("获取value值",e.detail)   // {value: "ff", cursor: 2}
    this.setData({
      inputValue: e.detail.value
    })
    // this.setData({
    //   searchresult: true,
    // })
  },
  /**
   * 点击搜索提交跳转并存储历史记录
   */
  searchbegin: function (e) {
    let _this = this
    var data = e.currentTarget.dataset;
    _this.data.replaceValue = e.currentTarget.dataset.postname
    // _this.data.replaceValue = 
    wx: wx.setStorage({
      key: 'historyStorage',
      data: _this.data.historyStorage.concat(_this.data.inputValue).reverse(),
      data: _this.data.historyStorage.concat(_this.data.replaceValue).reverse()
    })
    // console.log(_this.data.inputValue)
    // console.log(_this.data.historyStorage)
    // console.log(data['postname'])
    if (data['postname'] == '') {
      wx.showToast({
        title: '请先输入品牌或商品',
        icon: 'none'
      })
    } else {
      wx.switchTab({
        url: '../classify/classify',
      })
    }
  },

  // 跳转到商品分类
  goToClassify () {
    wx.switchTab({
      url: '../classify/classify',
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 历史搜索
    let that = this;
    that.searchtype = options.searchtype;
    wx.getStorage({
      key: 'historyStorage',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          historyStorageShow: true,
          historyStorage: res.data
        })
      }
    })
    this.setData({
      inputValue: options.inputValue
    })
    this.data.inputValue = options.inputValue
    // console.log(this.data.inputValue)
  },
  goUpdate: function () {
    this.onLoad()
    // console.log("我更新啦")
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