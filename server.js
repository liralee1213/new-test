// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 模拟数据库，实际应用中应连接到真实数据库
const users = [
  { id: 1, username: 'admin', passwordHash: '$2b$10$ur4ULOfp1Oa57ERV7KEFuup4rNL5AVIgWprvyOey7mBweOk1OlWMS' }, // 密码为 "password"
  // 可添加更多用户信息
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 在数据库中查找用户名
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.json({ success: false, message: '用户不存在' });
  }

  // 使用bcrypt进行密码比对
  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (err) {
      return res.json({ success: false, message: '发生错误，请重试' });
    }
    if (result) {
      return res.json({ success: true, message: '登录成功' });
    } else {
      return res.json({ success: false, message: '密码不正确' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
