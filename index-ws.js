const express = require('express');
const server = require('http').createServer();
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(PORT, () => {
  console.log('Listening on ' + PORT);
});

process.on('SIGINT', () => {
  try {
    console.log('Shutting down server...');
    wss.clients.forEach((client) => {
      client.close();
    });
    server.close(() => {
      shutdownDB();
      console.log('Server is shut down.');
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Begin Websocket
 */
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log('Clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to my server!');
  }

  db.run(
    `INSERT INTO visitors(count, time) VALUES(${numClients}, datetime('now'))`
  );

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client has disconnected!');
  });
});

wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/**
 *End Websocket
 */

/**
 * Start Database
 */
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(
    `CREATE TABLE visitors(
        count INTEGER,
        time TEXT
      )`,
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
});

function getCount() {
  db.each('SELECT * FROM visitors', (err, row) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(row);
  });
}

function shutdownDB() {
  getCount();
  console.log('Shutting down db...');
  db.close();
}
/**
 * End Database
 */
