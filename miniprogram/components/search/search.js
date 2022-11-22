// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch (e) {
      const searchValue = e.detail
      wx.navigateTo({
        url: '../searchResult/searchResult?name='+searchValue,
      })
    },

    
    onCancel () {
      this.setData({
        value: ''
      })
    }
  }
})
