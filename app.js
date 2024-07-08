const http = require('http');

http
  .createServer(function (req, res) {
    res.write('On the way to be a fullstack engineer');
    res.end();
  })
  .listen(3001);

console.log('server started on port 3001');
