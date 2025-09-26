const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('文件未找到');
      } else {
        res.writeHead(500);
        res.end('服务器错误: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log('🚀 正弦余弦曲线可视化工具已启动！');
  console.log('📱 本地访问地址: http://localhost:' + port);
  console.log('💻 网络访问地址: http://' + getLocalIP() + ':' + port);
  console.log('📖 使用说明:');
  console.log('   - 在浏览器中打开上述地址');
  console.log('   - 使用滑块调节函数参数');
  console.log('   - 点击动画按钮查看动态效果');
  console.log('   - 支持键盘快捷键操作');
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
});

function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}