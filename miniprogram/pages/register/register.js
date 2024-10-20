// miniprogram/pages/register/register.js
const api = require('../../utils/api.js');

Page({
  data: {
    errorMessage: '',
    successMessage: ''
  },
  
  onSubmit(event) {
    const { username, password } = event.detail.value;
    if (!username || !password) {
      this.setData({ errorMessage: '请输入用户名和密码', successMessage: '' });
      return;
    }
    api.register(username, password)
      .then(res => {
        this.setData({ successMessage: '注册成功！请登录。', errorMessage: '' });
        wx.navigateTo({
          url: '/pages/login/login'
        });
      })
      .catch(err => {
        this.setData({ errorMessage: err.message || '注册失败', successMessage: '' });
      });
  },
  
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});
