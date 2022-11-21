// pages/points/points.js
import Notify from '@vant/weapp/notify/notify';

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    openid: '',
    pointsList: []
  },

  toExchange (e) {
    var that = this
    const id = e.target.dataset.id
    wx.cloud.callFunction({
      name:'OpenId',
      success(res){
        that.setData({
          openid: res.result.openid
        })
        db.collection('points_shopping')
        .where({
          price: _.lt(10000)
        }).get({
          success(res) {
            // console.log('res', res.data);
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i]._id === id) {
                const id = res.data[i]._id
                console.log('id', id);
                const point = res.data[i].points
                console.log(point);
                if (app.globalData.score === 0) {
                  // 危险通知
                  Notify({ type: 'warning ', 
                  message: '你还没有积分喔',
                  color: '#ad0000',
                  background: '#ffe1e1' });
                  return
                } else {
                  wx.cloud.callFunction({
                    name:'deletePoints',
                    data:{
                      id: id
                    },
                    success(res){
                      console.log("兑换成功", res);
                      that.onLoad()
                      wx.showToast({
                        title: '兑换成功',
                      })
                      app.globalData.score-=point
                      console.log('当前积分', app.globalData.score);
                      that.onLoad()
                    },
                    fail(res){
                      console.log("兑换失败",res);
                    }
                  })
                }
              }
            }
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var score = app.globalData.score
    var product = []
    that.setData({
      score: score
    })
    // 获取积分商城商品列表
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'OpenId',
      success(res){
        that.setData({
          openid: res.result.openid
        })
        db.collection('points_shopping')
        .where({
          price: _.lt(10000)
        }).get({
          success(res){
            // for(var i = 0; i < res.data.length; i++){
            //   if(res.data[i]._openid == that.data.openid){
            //     console.log(res.data[i]);
            //     product.push(res.data[i]);
            //     that.setData({
            //       pointsList: product
            //     })
            //     console.log(that.data.pointsList)
            //   }
            // }
            // console.log(res.data);
            product = res.data
            that.setData({
              pointsList: product
            })
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      fail(err) {
        console.log(err);
      }
    })
    wx.hideLoading()
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