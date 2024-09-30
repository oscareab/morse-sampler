
import express from 'express'
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.static('public', {
  extensions: ['html']
}));
app.use('/node_modules', express.static('node_modules'));

io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);


  socket.on('pinkPress', function() {
    io.emit('killPink')
  });

  socket.on('bluePress', function() {
    io.emit('killBlue')
  });

  socket.on('greenPress', function() {
    io.emit('killGreen')
  });

  socket.on('purpPress', function() {
    io.emit('killPurp')
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
    console.log('Disconnected user ID:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});
