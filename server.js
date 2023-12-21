const express = require("express"); 
const socket = require("socket.io");
const cors = require("cors");

const app = express(); 
app.use(cors());

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
    console.log("Server running on port "  + port);
})

let io = socket(server, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
        credentials: false
    }
});

io.on("connection", (socket) => {
    console.log("Made socket connection", socket.id);
    // Received data
    socket.on("beginPath", (data) => {
        // data -> data from frontend
        // Now transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    })
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
})
