// pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

const _ = db.command

let currentPage = 0 // 当前第几页,0代表第一页 
let pageSize = 4 //每页显示多少数据 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      'https://636c-cloud1-6g0yx3hi0dd04e91-1314458791.tcb.qcloud.la/swiper-pic1.jpg?sign=ebdec4ced599732336528eac2b704201&t=1666767642',
      'https://636c-cloud1-6g0yx3hi0dd04e91-1314458791.tcb.qcloud.la/swiper-pic2.jpg?sign=2c9fbf816f42bdabea24d0b7423dd05d&t=1666767792',
      'https://636c-cloud1-6g0yx3hi0dd04e91-1314458791.tcb.qcloud.la/swiper-pic3.jpg?sign=f69f0d23e9494f3886fb1cddd24e9b4a&t=1666767806'
    ],
    msgList: [
      { url: "/miniprogram/pages/index/index.js", title: "<11·11>大牌新品推荐，折扣+满减，想不到的低价等你来抢" },
      { url: "/miniprogram/pages/index/index.js", title: "<11·11>新品推荐想不到的低价等你来抢" },
      { url: "/miniprogram/pages/index/index.js",title: "<11·11>大牌新品推荐，折扣+满减，想不到的低价等你来抢" }],
    array: [
      {img:'../../icons/collection.png',name:'我的收藏', url: '../myCollection/myCollection'},
      {img:'../../icons/points.png',name:'积分商城', url: '../points/points'},
      {img:'../../icons/member.png',name:'会员', url: '../member/member'},
      {img:'../../icons/distribution.png',name:'分销中心', url: '../distribute/distribute'}
    ],
    value1: 0,
    value2: 0,
    switch1: '',
    switch2: '',
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 }
    ],
    option2: [
      { text: '默认排序', value: 0 },
      { text: '好评排序', value: 1 },
      { text: '销量排序', value: 2 }
    ],
    openid: '',
    _openid: '',
    productList: [],
    orderList: [], // 商品排序后的结果
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false //“没有数据”的变量，默认false，隐藏
  },

  // 商品过滤排序：全部商品列
  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
    if (this.data.switch1 == 1) {
      db.collection('product_shopping')
      .where({
        fenlei: '女装'
      })
      .get({
        success(res){
          console.log(res.data);
          this.setData({
            orderList: res.data
          })
        },
        fail(err){
          console.log("失败");
        }
      })
    }
  },

  // 商品过滤排序：默认排序列
  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
    if (this.data.switch2 == 1) {
      db.collection('product_shopping')
      .orderBy('fenlei', 'desc')
      .get({
        success(res){
          console.log(res.data);
          this.setData({
            orderList: res.data
          })
          this.onLoad()
        },
        fail(err){
          console.log("失败");
        }
      })
    } else if (this.data.switch2 == 2) {
      db.collection('product_shopping')
      .orderBy('points', 'desc')
      .get({
        success(res){
          console.log(res.data);
          this.setData({
            orderList: res.data
          })
          this.onLoad()
        },
        fail(err){
          console.log("失败");
        }
      })
    }
  },

  // 跳转商品详情页
  GoToProduct(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'OpenId',
      success(res){
        // console.log(res.result.openid);
        // that.setData({
        //   openid:res.result.openid
        // })
        db.collection('product_shopping').where({
          price: _.lt(10000)
        })
        .skip(2)
        .get({
          success(res){
            wx.hideLoading({
              success: (res) => {},
            })
            // console.log("获取商品成功",res.data);
            that.setData({
              productList: res.data
            })
          },
          fail(res){
            console.log("失败");
          }
        })
      }
    })
  },

  getData() {
    let that = this;
    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    //云数据的请求
    db.collection('product_shopping').where({
      price: _.lt(10000)
    })
      .skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get({
        success(res) {
          if (res.data && res.data.length > 0) {
            console.log("请求成功", res.data)
            currentPage++
            //把新请求到的数据添加到dataList里  
            let list = that.data.productList.concat(res.data)
            that.setData({
              productList: list, //获取数据数组    
              loadMore: false //把"上拉加载"的变量设为false，显示
            });
            if (res.data.length < pageSize) {
              that.setData({
                loadMore: false, //隐藏加载中。。
                loadAll: true //所有数据都加载完了
              });
            }
          } else {
            that.setData({
              loadAll: true, //把“没有数据”设为true，显示  
              loadMore: false //把"上拉加载"的变量设为false，隐藏  
            });
          }
        },
        fail(res) {
          console.log("请求失败", res)
          that.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
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
    console.log("上拉触底事件")
    let that = this
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });

      //加载更多，这里做下延时加载
      setTimeout(function() {
        that.getData()
      }, 2000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})