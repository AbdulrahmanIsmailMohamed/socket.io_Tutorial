const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.set("view engine", "ejs");

app.get("/home", (req, res) => {
    res.render("home", { port });
});

io.on("connection", (socket) => {
    console.log(`The User Id: ${socket.id}`);
    socket.on("message", (data) => {
        socket.broadcast.emit("message", data);
    })
})

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`The Server Running On Port ${port}`));