const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
});

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.all('/webhook', (req, res) => {
  const requestData = {
    body: req.body,
    hostname: req.hostname,
    method: req.method,
    path: req.path,
    query: req.query,
  };
  console.log(requestData);
  io.emit('received', requestData);
  res.sendStatus(200);
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));
