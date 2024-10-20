// miniprogram/utils/api.js
const BASE_URL = 'https://tabiyaku-124680-8-1330406997.sh.run.tcloudbase.com/api'; // 替换为您的后端域名

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
          'Authorization': `Bearer ${getApp().globalData.accessToken}` // 确保使用反引号
        },
        formData: {},
        success(res) {
          try {
            const data = JSON.parse(res.data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(data);
            } else {
              reject(data);
            }
          } catch (e) {
            // 解析失败时，显示原始响应内容
            reject({ message: '解析响应失败', rawData: res.data });
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
      'Authorization': `Bearer ${getApp().globalData.accessToken}` // 确保使用反引号
    });
  }
};

module.exports = api;