// miniprogram/pages/upload/upload.js
const api = require('../../utils/api.js');

Page({
  data: {
    imageSrc: '',
    successMessage: '',
    errorMessage: '',
    translationResult: ''
  },
  
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          imageSrc: res.tempFilePaths[0],
          successMessage: '',
          errorMessage: '',
          translationResult: ''
        });
      },
      fail: () => {
        this.setData({ errorMessage: '选择图片失败' });
      }
    });
  },
  
  uploadImage() {
    const { imageSrc } = this.data;
    if (!imageSrc) {
      this.setData({ errorMessage: '请选择一张图片' });
      return;
    }
    api.uploadImage(imageSrc)
      .then(res => {
        this.setData({
          successMessage: '上传并翻译成功！',
          translationResult: res.chinese_translation,
          errorMessage: ''
        });
        // 刷新记录页面（如果需要，可以通过全局事件或重定向实现）
      })
      .catch(err => {
        this.setData({ errorMessage: err.message || '上传失败', successMessage: '', translationResult: '' });
      });
  }
});
