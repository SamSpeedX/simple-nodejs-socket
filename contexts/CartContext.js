import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCarts = () => {
        setLoading(true);

        socket.emit("get-carts");

        socket.once("get-carts-response", (res) => {
            setCarts(res.data || []);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCarts();

        socket.on("cart-updated", (data) => {
            setCarts(data);
        });

        return () => {
            socket.off("cart-updated");
        };
    }, []);

    return (
        <CartContext.Provider value={{ carts, loading, fetchCarts }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
};