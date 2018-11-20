
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 12121;
var MAC = "A"; //테스트용 MAC 최초에 0|A|0|0|0 으로 MAC이름: A 인 Plug 를 DB에 생성후 테스트 진행

process.stdin.resume();         // 표준입력처리(입력받을수 있도록 변경)
var client = new net.Socket();
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    client.on('data', function(data){       // 서버로부터 데이터 수신시 콘솔에 출력(PUT으로 웹에서 WAS통해서 클라이언트로 옴)
       console.log(data.toString());        //put 테스트시 localhost:9999/api/plug/:id 로 permission:1 변경 해야 가능
                                            //id 는 db 접속하거나 localhost:9999/api/plug 에서 확인가능
       var senddata = "1|"+MAC+"|"+data;    //또는 DB 에서 직접 바꾼 후 가능
       client.write(senddata);
    });
});




client.on('end', function(data){
   console.log(data.toString());
});

client.on('close', function(){
   console.log('close client....');
});

// 사용자가 콘솔에서 텍스트를 입력하였을 경우 write함수로 서버에 전송
process.stdin.on('data', function(data){
   if(data.toString().trim().toLowerCase() == 'quit'){
       console.log('request disconnect');
       client.write(data);
       process.stdin.end();
   }else{
       client.write(data);
   }
})
