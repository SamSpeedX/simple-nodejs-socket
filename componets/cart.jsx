import { useCart } from "../context/CartContext";

export default function CartPage() {
    const { carts, loading, fetchCarts } = useCart();

    return (
        <div>
            <button onClick={fetchCarts}>
                Refresh Cart
            </button>

            {loading && <p>Loading...</p>}

            {carts.map((item) => (
                <div key={item.id}>
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                </div>
            ))}
        </div>
    );
}