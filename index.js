const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on("connection", (socket) => {
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
		io.to(roomId).emit("user-connected", userId);
		console.log(userId + " :is connected");
	});

	socket.on("disconnect", () => {
		io.to(Object.keys(socket.rooms)[1]).emit(
			"user-disconnected",
			socket.id
		);
	});

	socket.on("send-message", (roomId, message, senderId, userName) => {
		io.to(roomId).emit("message-received", message, senderId, userName);
		io.to(roomId)("message-received", message, senderId, userName);
		// socket.emit("message-received", message, senderId, userName);
		console.log(message);
	});
});
// I want the message to also be reaceved by the sender

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on port ${port}...`));
