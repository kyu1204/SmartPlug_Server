/////////////////////////////////////////////- INIT (TCP/IP + DB) - //////////////////////////////////////////////
var net = require('net');
var port = 5000;
var tcp_server = net.createServer();
var mysql = require('mysql');
var config = require('./db_info').local;
var connection = mysql.createConnection(config);
//!!!! 아래의 clientSockets 배열 중요
var clientSockets = []; // 클라이언트가 접속할경우 소켓을 저장할 배열

///////////////////////////////////////////- INIT (WAS) -////////////////////////////////////////////
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//////////////////////////////////////////////- WAS -/////////////////////////////////////////////
var was_server = app.listen(9999, function() {
  console.log("Express server has started on port 9999");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var posts = require('./router/plugs')(clientSockets);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', posts);
////////////////////////////////////////////////- TCP/IP + DB -///////////////////////////////////////////////////////////
// Connection 이벤트는 클라이언트가 접속할때마다 계속 호출된다.
tcp_server.on('connection', function(socket) {
  console.log('test');
  console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
  clientSockets.push(socket); // 사용자가 접속시 마다 소켓을 rop)|MAC|PLUG1|PLUG2|PLUG3|PERMISS저장(향후 텍스트 전송시 이 배열만 조회하면 된다.
  // 사용자가 접속시마다 데이터를 전송해오면 접속한 클라이언트의 소켓을
  // clientSockets배열에서 비교하여 모두 전송처리
  socket.on('data', function(data) {
    console.log(socket.remoteAddress + ':' + socket.remotePort + '// recv data:' + data.toString());
    var datas = data.toString().split('|'); //FLAG(0:create 1:release 2:drop)|MAC|PLUG1|PLUG2|PLUG3|PERMISSTION
    var flag = datas[0].toString();
    switch (flag) {
      case '0': //CreateAC|PLUG
        { //mac check
          connection.query('select mac_id from plug where mac_id=?', datas[1], function(err, result) {
            if (!err && result == "") {
              var ip = socket.remoteAddress;
              if (ip && ip.startsWith("::ffff:"))
                ip = ip.replace("::ffff:", "");
              var port = socket.remotePort.toString();
              var plugData = {
                'mac_id': datas[1], //mac
                'ip': ip, //remote ip
                'port': port, //remote port
                'plug1': datas[2],
                'plug2': datas[3],
                'plug3': datas[4],
                'permission': 0 //default 0 -> admin page permission change
              };
              connection.query('insert into plug set ?', plugData, function(err, result) {
                if (!err)
                  console.log('success!');
                else
                  console.log('Error while performing Query.', err);
              });
            }
          });
          break;
        }

      case '1': //update -->
        { //mac check
          connection.query('select mac_id from plug where mac_id=' + mysql.escape(datas[1]), function(err, result) {
            if (!err && result != "") {
              connection.query('select * from plug where mac_id=' + mysql.escape(datas[1]), function(err, rows, fields) {
                if (!err && rows[0].PERMISSION != 0) {
                  //plugs state, mac_id
                  var plugData = [{
                    'plug1': datas[2],
                    'plug2': datas[3],
                    'plug3': datas[4]
                  }, datas[1]];
                  connection.query('update plug set ? where mac_id=?', plugData, function(err, result) {
                    if (!err)
                      console.log('Update Success!');
                    else
                      console.log('Error while performing Query.', err);
                  });
                }
              });
            }
          });

          break;
        }
      case '2':
        {
          connection.query('select mac_id from plug where mac_id=?', datas[1], function(err, result) {
            if (!err && result == "") {
              connection.query('select * from plug where mac_id=' + mysql.escape(datas[1]), function(err, rows, fields) {
                if (!err && rows[0].PERMISSION == 0) {
                  connection.query('delete from plug where mac_id=?', datas[1], function(err, result) {
                    if (!err)
                      console.log('Delete Success!');
                    else
                      console.log('Error while performing Query.', err);
                  });
                }
              });
            }
          });
          break;
        }
    }
    if (data.toString().trim().toLowerCase() == 'quit') {
      socket.write('>>>> disconnect client....');
      return socket.end();
    }
  });
  socket.on('close', function() {
    // 종료된 소켓의 인덱스값을 알아낸다.
    var index = clientSockets.indexOf(socket);
    if (index != -1)
      clientSockets.splice(index, 1); // 리스트에서 제거
  });
});

tcp_server.on('error', function(err) {
  console.log('error:' + err.message);
  connection.end();
});

tcp_server.on('close', function() {
  console.log('stop server...');
  connection.end();
});

tcp_server.on('listening', function(socket) {
  console.log(tcp_server.address());
});


tcp_server.listen(port);
