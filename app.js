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

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket이 들어온다
io.on('connection', (socket) => {
	// 접속한 클라이언트의 정보가 수신되면
	socket.on('login', (data) => {
		console.log(
			'Client logged-in:\n name:' + data.name + '\n userId' + data.userid
		);

		// socket에 클라이언트 정보를 저장한다
		socket.name = data.name;
		socket.userid = data.userid;

		// 접속된 모든 클라이언트에게 메세지를 전송한다
		io.emit('login', data.name);
	});

	// 클라이언트로부터의 메세지가 수신되면
	socket.on('chat', (data) => {
		console.log('Message from %s: %s', socket.name, data.msg);

		var msg = {
			from: {
				name: socket.name,
				userid: socket.userid,
			},
			msg: data.msg,
		};

		// 메세지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메세지 전송
		socket.broadcast.emit('chat', msg);

		// 메시지를 전송한 클라이언트에게만 메시지를 전송한다
		// socket.emit('s2c chat', msg);

		// 접속된 모든 클라이언트에게 메시지를 전송한다
		// io.emit('s2c chat', msg);

		// 특정 클라이언트에게만 메시지를 전송한다
		// io.to(id).emit('s2c chat', data);
	});

	// force client disconnect from server
	socket.on('forceDisconnect', () => {
		socket.disconnect();
	});

	socket.on('disconnect', () => {
		console.log('user disconnected: ' + socket.name);
	});
});
