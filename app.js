const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.set("view engine", "ejs");

app.get("/home", (req, res) => {
    // res.set("Access-CONTROL-ALLOW-ORIGIN","*")
    res.render("home", { port });
});


let clients = 0;
// when the user connected
io.on("connection", (socket) => {
    console.log(`The User Id: ${socket.id} Connected...`);

    // count the number of connections
    clients++;
    io.sockets.emit("broadcast", { description: `${clients} Clients Connection` })

    // message send to all users in client side after 3 seconds of connect
    setTimeout(() => {
        socket.emit("serverEvent", socket.id)
    }, 3000);

    socket.on("message", (data) => {
        socket.broadcast.emit("message", data);
    });

    // when the user disconnected or walked out of the room 
    socket.on("disconnect", () => {
        clients--;
        io.sockets.emit("broadcast", { description: `${clients} Clients Connections` })
        console.log(`The User Id ${socket.id} DisConnected!!`);
    })
})


/**
* * name space
const nsp = io.of("/name-space");
nsp.on("connection", (socket) => {
    console.log("Some One Connected!!");
    nsp.emit("hi", "Hello, welcom to my namespace")
})*/

/**
* * join to room 
let nsp = io.of("/joinRoom");
nsp.on("connection", (socket) => {
    console.log("Hi");
    socket.join("room1")
    nsp.in("room1").emit("connectToRoom","The User Connect To Room");
    // socket.leave("room1")
})
*/
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`The Server Running On Port ${port}`));