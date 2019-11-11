// Express를 사용하여 Http 서버 생성
var app = require('express')();
var server = require('http').createServer(app);

// 생성된 http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

server.listen(3000, () => {
	console.log('Socket IO server listening on port 3000');
});

// root url에 대한 라우트 정의
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
