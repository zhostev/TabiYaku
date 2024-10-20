// miniprogram/pages/login/login.js
const api = require('../../utils/api.js');

Page({
  data: {
    errorMessage: ''
  },
  
  onSubmit(event) {
    const { username, password } = event.detail.value;
    if (!username || !password) {
      this.setData({ errorMessage: '请输入用户名和密码' });
      return;
    }
    api.login(username, password)
      .then(res => {
        wx.setStorageSync('access_token', res.access_token);
        getApp().globalData.accessToken = res.access_token;
        wx.navigateTo({
          url: '/pages/upload/upload'
        });
      })
      .catch(err => {
        this.setData({ errorMessage: err.message || '登录失败' });
      });
  },
  
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
