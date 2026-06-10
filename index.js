import { io } from "socket.io-client";
import express from "express";
const app = express();
const port = 3000

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("test", {
        message: "Hello Server"
    });
});

socket.on("test-response", (data) => {
    console.log("Response:", data);
    setInterval(() => {
        socket.emit("test", {
            message: "Hello Server"
        });
    }, 10000);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})