// pages/member/member.js
const app = getApp();
const db = wx.cloud.database();

const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    goods: [],
    vipType: '付费升级',
    vipState: 0,
    vipMoney: 4999,
    openid: '',
    memberInfo: {
        avatarUrl: '',
        nickName: ''
    },
    isMember: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var token = wx.getStorageSync('__appUserInfo').token;
  },

    getVipTap (e) {
        var id = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        var token = wx.getStorageSync('__appUserInfo').token;
        var that = this;
        wx.showModal({
            title:'交易提示',
            content:'确认支付'+that.data.vipMoney+'元?',
            success(res){
                if(res.confirm == true) {
                    wx.getUserProfile({
                        desc: '成为会员', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                        success: (res) => {
                          that.setData({
                            nickName: res.userInfo.nickName,
                            avatarUrl: res.userInfo.avatarUrl
                          })
                          wx.setStorage({    //数据缓存方法
                            key: 'nickName',   //关键字，本地缓存中指定的key
                            data: res.userInfo.nickName,    //缓存微信用户公开信息，
                            success: function() {      //缓存成功后，输出提示
                              console.log('写入nickName缓存成功')
                            },
                            fail: function() {        //缓存失败后的提示
                              console.log('写入nickName发生错误')
                            }
                          })
                          wx.setStorage({    //数据缓存方法
                            key: 'avatarUrl',   //关键字，本地缓存中指定的key
                            data: res.userInfo.avatarUrl,    //缓存微信用户公开信息，
                            success: function() {      //缓存成功后，输出提示
                              console.log('写入avatarUrl缓存成功')
                            },
                            fail: function() {        //缓存失败后的提示
                              console.log('写入avatarUrl发生错误')
                            }
                          })
                            db.collection('member').add({
                                data:{
                                    openid: that.data.openid,
                                    nickName: that.data.nickName,
                                    avatarUrl: that.data.avatarUrl
                                },
                                success(res){
                                    console.log("会员支付成功");
                                    wx.showToast({
                                        title: '支付成功',
                                        duration:5000,
                                        success(res){
                                            wx.switchTab({
                                                url: '../me/me',
                                            })
                                            wx.setStorage({    //数据缓存方法
                                                key: 'MemberTrue',   //关键字，本地缓存中指定的key
                                                data: app.globalData.isMember,    //缓存微信用户公开信息，
                                                success: function() {      //缓存成功后，输出提示
                                                  console.log('写入isMember缓存成功，成功记载该用户')
                                                },
                                                fail: function() {        //缓存失败后的提示
                                                  console.log('写入isMember缓存失败')
                                                }
                                              })
                                            that.setData({
                                                isMember: true
                                            })
                                            app.globalData.isMember = true
                                        }
                                    })
                                },
                                fail(res){
                                console.log("会员支付失败",res);
                                }
                            })
                        }
                      })
                }
            },
            fail(res){}
        })
        console.log('isMember', app.globalData.isMember);
    },
    toDetailsTap: function toDetailsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})