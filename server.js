import { createServer } from 'http'
import { Server } from 'socket.io'
import api from './services/api.js';

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

// io.use(async (socket, next) => {
//     const token = socket.handshake.auth.token;
//     console.log("Token:", token);

//     if (!token) {
//         return next(new Error("Unauthorized"));
//     }

//     try {
//         const res = await api.get("/user", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });

//         console.log("User Res:", res.data);
//         socket.user = res.data;

//         return next();
//     } catch (error) {
//         console.log("Auth Error:", error?.response?.data || error.message);
//         return next(new Error("Unauthorized"));
//     }
// });

io.on("connection", (socket) => {
    console.log("Socket: ", socket.id);

    socket.on("test", (data) => {
        console.log("Test received: ", data);
        socket.emit("test-response", {
            message: "Hello Client",
            timestamp: new Date().toISOString()
        });
    });

    socket.on("add-cart", async (data) => {
        try {
            const token = socket.handshake.auth.token;
            const res = await api.post(`/v1/user/cart/add`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            console.log("Response: ", res.data);
            socket.emit("carts", {
                data: res.data.iterms,
                message: res.data?.message,
            });
        } catch (error) {
            socket.emit("add-cart-response", {
                message: error?.response?.data || error?.message || error,
                data: [],
            });
            console.log("Error: ", error?.response?.data || error?.message || error);
        }
    });

    socket.on("get-carts", async () => {
        try {
            const token = socket.handshake.auth.token;
            const res = await api.get("/v1/user/carts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            socket.emit("get-carts-response", {
                data: res.data.items,
                message: res.data?.message,
            });
        } catch (error) {
            socket.emit("get-carts-response", {
                message: error?.response?.data || error?.message || "Error occurred",
                data: [],
            });
            console.log("Error:", error?.response?.data || error?.message);
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