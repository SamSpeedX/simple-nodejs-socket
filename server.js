import { createServer } from 'http'
import { Server } from 'socket.io'
import api from './api';

const httpServer = createServer();
const io = new Server(httpServer, {
    path: "/",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingInterval: 60000,
    pingTimeout: 25000,
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    console.log("Token:", token);

    if (!token) {
        return next(new Error("Unauthorized"));
    }

    next();
});

io.on("connection", (socket) => {
    console.log("Socket: ", socket.id);

    socket.on("test", (data) => {
        console.log("Test received: ", data);
        socket.emit("test-response", {
            message: "Hello Client",
            timestamp: new Date().toISOString()
        });
    });

    socket.on("add-cart", async(data) => {
        try {
            const res = await api.get(`/v1/user/cart`, data.items, {
                headers: {
                    "Authorization": data.token,
                }
            });
            console.log("Response: ", res.data);
            socket.emit("add-cart-response", {
                data: res.data.iterms
            });
        } catch (error) {
            console.log("Error: ", error?.response?.data || error?.message || error);
        }
    });

    socket.on("get-carts", async(data) => {
        try {
            const res = await api.get("/v1/user", {}, {
                headers: {
                    "Authorization": data.token,
                }
            });
        } catch (error) {
            console.log("Error: ", error?.response?.data || error?.message || error);
        }
    });
});

const PORT = 5000
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})