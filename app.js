var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http');
var moment = require('moment');

var redis = require('redis');
var redisClient = redis.createClient(6380, "127.0.0.1");
var redisKey = "command";

var server = http.createServer(app);
var port = 9999;
server.listen(port, function() {
  console.log('listening on *:' + port);
});

var modes = [
  { mode: 'wakeup', time: '2015-10-31T06:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'navi', time: '2015-10-31T07:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'lunch', time: '2015-10-31T12:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'vibrate', time: '2015-10-31T14:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'call', time: '2015-10-31T18:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'workout', time: '2015-10-31T20:00:00+09:00', lat: 1, lng: 2 },
  { mode: 'sleep', time: '2015-10-31T23:00:00+09:00', lat: 1, lng: 2 }
];

app.get('/', function(req, res) {
  redisClient.get(redisKey, function(err, flag) {
    flag = flag || 0;
    var data = modes[flag];
    res.status(res.statusCode).json(data);
  });
});

app.put('/command', function(req, res) {
  var flag = req.query.flag || 0;
  redisClient.set(redisKey, flag);

  var data = modes[flag];
  res.status(res.statusCode).json(data);
});

app.get('/hi', function(req, res) {
  res.send('Hello, Samantha =)');
});

app.get('/health', function(req, res) {
  res
  .status(res.statusCode)
  .json({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});
