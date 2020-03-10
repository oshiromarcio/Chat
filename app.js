const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let clients = {};

app.get("/", function(req, res) {
    res.send("Server is running");
});

io.on("connection", function(client) {
    console.log("user Connected");

    client.on("join", function(name) {
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.");
    });

    client.on("send", function(msg) {
        console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function() {
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});
