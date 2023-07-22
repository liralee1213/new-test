const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const redis = require('redis');
const fs = require('fs');
const cors = require('cors'); // 添加 cors 模块
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // 添加 CORS 中间件，允许所有来源访问后端

// 连接到阿里云数据库 Redis 版
const redisClient = redis.createClient({
  port: 6379,
  host: 'r-uf6mggews04r8rv2c7.redis.rds.aliyuncs.com',
  password: 'XyEddsw_AQg@x3t',
});

// 监听连接成功事件
redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

// 监听连接错误事件
redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

// 记录日志函数
function logToFile(logMessage) {
  const logFileName = 'app.log';
  const logEntry = `${new Date().toISOString()}: ${logMessage}\n`;

  fs.appendFile(logFileName, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

// 用户注册接口
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  logToFile(`Received registration request for username: ${username}`); // 记录接收到的注册请求

  // 在数据库中查找用户名
  redisClient.get(username, (err, existingUser) => {
    if (err) {
      logToFile('Error finding user:', err);
      return res.json({ success: false, message: '发生错误，请重试' });
    }

    if (existingUser) {
      logToFile(`Registration failed. Username "${username}" already exists.`);
      return res.json({ success: false, message: '用户名已存在' });
    }

    // 使用 bcrypt 对密码进行哈希处理
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        logToFile('Error hashing password:', err);
        return res.json({ success: false, message: '发生错误，请重试' });
      }

      // 将新用户存储到 Redis 中
      redisClient.set(username, hash, (err) => {
        if (err) {
          logToFile('Error registering user:', err);
          return res.json({ success: false, message: '发生错误，请重试' });
        }

        logToFile(`User "${username}" registered successfully!`);
        res.json({ success: true, message: '注册成功' });
      });
    });
  });
});

app.listen(port, () => {
  logToFile(`Server is running on port ${port}`);
});
