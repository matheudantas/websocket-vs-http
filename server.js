const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.json({}));

app.get('/websocket', (req, res) => {
  res.render('websocket.html');
});
app.get('/http', (req, res) => {
  res.render('http.html');
});

const messages = [];

app.get('/messages', (req, res) => {
  return res.json(messages);
});

app.post('/messages', (req, res) => {
  messages.push(req.body);

  return res.json(messages);
});

io.on('connection', (socket) => {
  console.log(`new socket connected! ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);

    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000);
