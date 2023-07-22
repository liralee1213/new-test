document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    document.getElementById('response').innerHTML = '<p>确认密码与密码不一致，请重新输入！</p>';
    return;
  }

  // 构建注册请求的数据对象
  const userData = {
    username: username,
    password: password
  };

  // 发送注册请求给后端
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('response').innerHTML = '<p>注册成功！</p>';
    } else {
      document.getElementById('response').innerHTML = '<p>注册失败，请稍后再试！</p>';
    }
  })
  .catch(error => {
    document.getElementById('response').innerHTML = '<p>发生错误，请稍后再试！</p>';
  });
});
