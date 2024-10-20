// miniprogram/utils/api.js
const BASE_URL = 'https://your-backend-domain.com/api';

const request = (url, method, data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        ...headers
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail(error) {
        reject({ message: '网络错误', error });
      }
    });
  });
};

const api = {
  register: (username, password) => request('/register', 'POST', { username, password }),
  login: (username, password) => request('/login', 'POST', { username, password }),
  uploadImage: (imageData) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${BASE_URL}/upload_image`,
        filePath: imageData,
        name: 'image',
        header: {
          'Authorization': `Bearer ${getApp().globalData.accessToken}`
        },
        formData: {},
        success(res) {
          const data = JSON.parse(res.data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(data);
          }
        },
        fail(error) {
          reject({ message: '上传失败', error });
        }
      });
    });
  },
  getRecords: () => {
    return request('/records', 'GET', {}, {
      'Authorization': `Bearer ${getApp().globalData.accessToken}`
    });
  }
};

module.exports = api;
