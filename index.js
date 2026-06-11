import { io } from "socket.io-client";
import express from "express";
const app = express();
const port = 3000

import dotenv from "dotenv";
dotenv.config();

const token = process.env.TOKEN;
const socket = io("http://localhost:5000", {
    auth: {
        token: token,
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("test", {
        message: "Hello Server"
    });

    socket.emit("get-carts");
});

socket.on("test-response", (data) => {
    console.log("Response:", data);
});

socket.on("get-carts-response", (data) => {
    console.log("Carts: ", data);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})