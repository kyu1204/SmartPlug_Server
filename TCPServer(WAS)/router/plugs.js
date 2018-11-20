module.exports = function(clientSockets) {
  var express = require('express');
  var router = express.Router();
  var mysql = require('mysql');
  var config = require('../db_info').local;
  var db = mysql.createConnection(config);

  router.get('/title/:id', function(req, res, next) {
    console.log(clientSockets.length);
    res.json({
      title: "title-" + req.params.id
    });
  });

  router.put('/plug/:id', function(req, res) { //permission change
    var resdata = {};
    db.query('select _id from plug where _id=?', req.params.id, function(err, result) {
      if (result != "") {
        var plugData = [{
          'permission': req.body.PERMISSION,
          'name': req.body.NAME
        }, req.params.id];
        db.query('update plug set ? where _id=?', plugData, function(err, result) {
          resdata["success"] = 1;
          res.json(resdata);
        });
      } else {
        resdata["success"] = 0;
        resdata["error"] = 'incorrect id';
        res.json(resdata);
      }
    });

  });
  router.get('/plug/allow/:id', function(req, res) { //send data(nodemcu)
    db.query('UPDATE `plug_db`.`plug` SET `permission`=1 WHERE `_id`=?', req.params.id, function(err, result) {
      res.json("change");
    });
  });

  router.get('/plug/push/:id/:button', function(req, res) { //send data(nodemcu)
    // db.query('UPDATE `plug_db`.`plug` SET `permission`=1 WHERE `_id`=?', req.params.id, function (err, result) {
    //   res.json("change");
    // });
  });

  router.get('/plug/send/:id/:button', function(req, res) { //send data(nodemcu)
    var resdata = {};

    // if(req.params.PERMISSION == 1)
    {

      db.query('select ip,port,permission from plug where _id=?', req.params.id, function(err, result) {
        if (result != "" && result[0].permission == 1) {
          var index = -1;
          for (var i = 0; i < clientSockets.length; ++i) {
            ip = clientSockets[i].remoteAddress;
            if (ip && ip.startsWith("::ffff:"))
              ip = ip.replace("::ffff:", "");
            port = clientSockets[i].remotePort;

            if (ip == result[0].ip && port == result[0].port) {
              index = i;
              break;
            }
          }

          if (index == -1) {
            resdata["success"] = 0;
            resdata["error"] = 'not socket';
            res.json(resdata);
          } else {
            // var senddata = req.body.Plug1+"|"+req.body.Plug2+"|"+req.body.Plug3;

            var senddata = req.params.button;
            console.log(senddata);
            clientSockets[index].write("" + senddata);

            resdata["success"] = 1;
            res.json(resdata);

          }
        } else {
          resdata["success"] = 0;
          resdata["error"] = 'incorrect id or not permission';
          res.json(resdata);
        }
      });
    }
  });


  router.get('/plug/:id', function(req, res, next) { //plug:id
    db.query('select _id,name,plug1,plug2,plug3,permission from plug where _id=?', req.params.id, function(err, result) {
      var plug = result[0];
      res.json(plug);
    });
  });

  router.get('/plug', function(req, res, next) { //all plug
    db.query('select _id,name,plug1,plug2,plug3,permission from plug', function(err, result) {
      res.json(result);
    });
  });

  router.get('/login/:userid/:password', function(req, res) { //login id,passwd (admin,admin)
    var result = {};
    var userid = req.params.userid;
    var password = req.params.password;
    db.query('select id from admin where id=?', userid, function(err, data) {
      if (data != "") {
        db.query('select passwd from admin where passwd=?', password, function(err, data) {
          if (data != "") {
            result["success"] = 1;
            res.json(result);
          } else {
            result["success"] = 0;
            result["error"] = "incorrect";
            res.json(result);
          }
        })
      } else {
        result["success"] = 0;
        result["error"] = "incorrect";
        res.json(result);
      }
    });
  });

  return router;
}
