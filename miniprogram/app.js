// miniprogram/app.js
App({
    onLaunch() {
      // 获取本地存储的 access_token
      const accessToken = wx.getStorageSync('access_token');
      if (accessToken) {
        this.globalData.accessToken = accessToken;
      }
    },
    globalData: {
      accessToken: ''
    }
  });