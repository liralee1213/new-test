// script.js
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('response').innerHTML = '<p>登录成功！</p>';
    } else {
      document.getElementById('response').innerHTML = '<p>登录失败，请检查用户名和密码！</p>';
    }
  })
  .catch(error => {
    document.getElementById('response').innerHTML = '<p>发生错误，请重试！</p>';
  });
});
