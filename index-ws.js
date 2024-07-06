const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('server started on port 3000');
});

/**
 * Websockets
 */
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: app });

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log('Clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (wss.readyState === ws.OPEN) {
    ws.send('Welcome to my server!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client has disconnected!');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
