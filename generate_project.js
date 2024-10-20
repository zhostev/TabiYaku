// generate_project.js
const fs = require('fs');
const path = require('path');

const projectName = 'TabiYaku';
const baseDir = path.join(__dirname, projectName, 'miniprogram');
const pages = ['login', 'register', 'upload', 'records'];

const files = {
  'app.js': `App({
  onLaunch() {
    const accessToken = wx.getStorageSync('access_token');
    if (accessToken) {
      this.globalData.accessToken = accessToken;
    }
  },
  globalData: {
    accessToken: ''
  }
});
`,
  'app.json': `{
  "pages": [
    "pages/login/login",
    "pages/register/register",
    "pages/upload/upload",
    "pages/records/records"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "TabiYaku",
    "navigationBarTextStyle": "black"
  }
}
`,
  'app.wxss': `/* miniprogram/app.wxss */
.container {
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.button {
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
`
};

// Function to create directories and files
const createProject = () => {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`创建项目目录: ${baseDir}`);
  }

  // Create utils directory and api.js
  const utilsDir = path.join(baseDir, 'utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir);
    console.log(`创建目录: ${utilsDir}`);
  }
  fs.writeFileSync(path.join(utilsDir, 'api.js'), `// miniprogram/utils/api.js
const BASE_URL = 'https://your-backend-domain.com/api';

const request = (url, method, data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: \`\${BASE_URL}\${url}\`,
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
        url: \`\${BASE_URL}/upload_image\`,
        filePath: imageData,
        name: 'image',
        header: {
          'Authorization': \`Bearer \${getApp().globalData.accessToken}\`
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
      'Authorization': \`Bearer \${getApp().globalData.accessToken}\`
    });
  }
};

module.exports = api;
`);
  console.log(`创建文件: ${path.join(utilsDir, 'api.js')}`);

  // Create pages
  pages.forEach(page => {
    const pageDir = path.join(baseDir, 'pages', page);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
      console.log(`创建目录: ${pageDir}`);
    }

    // Create JSON file
    fs.writeFileSync(path.join(pageDir, `${page}.json`), `{
  "navigationBarTitleText": "${page === 'login' ? '登录' : page === 'register' ? '注册' : page === 'upload' ? '上传图片' : '我的翻译记录'}"
}`);
    console.log(`创建文件: ${path.join(pageDir, `${page}.json`)}`);

    // Create WXML file
    let wxmlContent = '';
    switch(page) {
      case 'login':
        wxmlContent = `<!-- miniprogram/pages/login/login.wxml -->
<view class="container">
  <view class="title">TabiYaku 登录</view>
  <form bindsubmit="onSubmit">
    <input name="username" placeholder="用户名" required />
    <input name="password" type="password" placeholder="密码" required />
    <button formType="submit" class="button">登录</button>
  </form>
  <view class="error-message">{{errorMessage}}</view>
  <button bindtap="goToRegister" class="button">没有账户？注册</button>
</view>`;
        break;
      case 'register':
        wxmlContent = `<!-- miniprogram/pages/register/register.wxml -->
<view class="container">
  <view class="title">TabiYaku 注册</view>
  <form bindsubmit="onSubmit">
    <input name="username" placeholder="用户名" required />
    <input name="password" type="password" placeholder="密码" required />
    <button formType="submit" class="button">注册</button>
  </form>
  <view class="error-message">{{errorMessage}}</view>
  <button bindtap="goToLogin" class="button">已有账户？登录</button>
</view>`;
        break;
      case 'upload':
        wxmlContent = `<!-- miniprogram/pages/upload/upload.wxml -->
<view class="container">
  <view class="title">上传图片进行翻译</view>
  <button bindtap="chooseImage" class="button">选择图片</button>
  <image src="{{imageSrc}}" mode="aspectFit" wx:if="{{imageSrc}}" /> 
  <button bindtap="uploadImage" class="button" wx:if="{{imageSrc}}">上传并翻译</button>
  <view class="success-message">{{successMessage}}</view>
  <view class="error-message">{{errorMessage}}</view>
  <view class="translation-result" wx:if="{{translationResult}}">
    <text>翻译结果:</text>
    <text>{{translationResult}}</text>
  </view>
</view>`;
        break;
      case 'records':
        wxmlContent = `<!-- miniprogram/pages/records/records.wxml -->
<view class="container">
  <view class="title">我的翻译记录</view>
  <button bindtap="fetchRecords" class="button">刷新记录</button>
  <view wx:if="{{records.length === 0}}">
    <text>暂无记录。</text>
  </view>
  <view wx:for="{{records}}" wx:key="id" class="record-item">
    <view><text>记录ID: </text><text>{{item.id}}</text></view>
    <view><text>翻译内容: </text><text>{{item.chinese_translation}}</text></view>
    <view><text>创建时间: </text><text>{{formatDate(item.created_at)}}</text></view>
  </view>
  <view class="error-message">{{errorMessage}}</view>
</view>`;
        break;
      default:
        wxmlContent = '';
    }
    fs.writeFileSync(path.join(pageDir, `${page}.wxml`), wxmlContent);
    console.log(`创建文件: ${path.join(pageDir, `${page}.wxml`)}`);

    // Create WXSS file
    let wxssContent = '';
    switch(page) {
      case 'login':
      case 'register':
        wxssContent = `/* miniprogram/pages/${page}/${page}.wxss */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #1aad19;
  color: white;
  border: none;
  border-radius: 5px;
}
`;
        break;
      case 'upload':
        wxssContent = `/* miniprogram/pages/upload/upload.wxss */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #1aad19;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
}

image {
  width: 200px;
  height: auto;
  margin-top: 10px;
}

.translation-result {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
`;
        break;
      case 'records':
        wxssContent = `/* miniprogram/pages/records/records.wxss */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #1aad19;
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
}

.record-item {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.record-item view {
  margin-bottom: 5px;
}
`;
        break;
      default:
        wxssContent = '';
    }
    fs.writeFileSync(path.join(pageDir, `${page}.wxss`), wxssContent);
    console.log(`创建文件: ${path.join(pageDir, `${page}.wxss`)}`);

    // Create JS file
    let jsContent = '';
    switch(page) {
      case 'login':
        jsContent = `// miniprogram/pages/login/login.js
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
`;
        break;
      case 'register':
        jsContent = `// miniprogram/pages/register/register.js
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
`;
        break;
      case 'upload':
        jsContent = `// miniprogram/pages/upload/upload.js
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
`;
        break;
      case 'records':
        jsContent = `// miniprogram/pages/records/records.js
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
`;
        break;
      default:
        jsContent = '';
    }
    fs.writeFileSync(path.join(pageDir, `${page}.js`), jsContent);
    console.log(`创建文件: ${path.join(pageDir, `${page}.js`)}`);
  });

  // Create utils/api.js is already done above.

  // Create project.config.json at root
  const projectConfig = `{
  "miniprogramRoot": "miniprogram/",
  "projectname": "TabiYaku",
  "description": "翻译日语菜单图片内容的微信小程序",
  "appid": "your-wechat-mini-program-appid",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true
  },
  "compileType": "miniprogram"
}
`;
  fs.writeFileSync(path.join(__dirname, projectName, 'project.config.json'), projectConfig);
  console.log(`创建文件: ${path.join(projectName, 'project.config.json')}`);

  // Create README.md
  const readme = `# TabiYaku

这是一个微信小程序前端，用于与后端 Flask 接口交互，实现用户注册、登录、图片上传和查看翻译记录等功能。

## 配置

1. 在 \`project.config.json\` 中将 \`appid\` 替换为您的微信小程序 AppID。
2. 在 \`utils/api.js\` 中将 \`BASE_URL\` 替换为您的后端 API 域名。

## 使用

1. 打开微信开发者工具。
2. 选择“导入项目”，选择 \`${projectName}/miniprogram\` 目录。
3. 配置 AppID 并完成项目导入。
4. 运行小程序进行测试。
`;
  fs.writeFileSync(path.join(__dirname, projectName, 'README.md'), readme);
  console.log(`创建文件: ${path.join(projectName, 'README.md')}`);

  console.log('微信小程序项目生成完成。');
};

createProject();
