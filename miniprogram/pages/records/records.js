// miniprogram/pages/records/records.js
const api = require('../../utils/api.js');

Page({
  data: {
    records: [],
    errorMessage: ''
  },
  
  onLoad() {
    this.fetchRecords();
  },
  
  fetchRecords() {
    api.getRecords()
      .then(res => {
        this.setData({
          records: res.records,
          errorMessage: ''
        });
      })
      .catch(err => {
        this.setData({ errorMessage: err.message || '获取记录失败' });
      });
  },
  
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }
});
