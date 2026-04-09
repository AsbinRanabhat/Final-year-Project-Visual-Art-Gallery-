import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { buildArtFallbackDataUri, setFallbackOnImageError } from '../utils/imageFallback.js';
import { CreditCard } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) return;

        setCheckingOut(true);
        try {
            const response = await fetch(`${API_BASE}/payment/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        _id: item._id,
                        productName: item.productName,
                        productPrice: item.productPrice,
                        quantity: item.quantity || 1,
                    })),
                    totalAmount: getCartTotal(),
                }),
            });

            const data = await response.json();
            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert(data.message || 'Payment initiation failed');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setCheckingOut(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-serif uppercase">Your Cart is Empty</h2>
                <a href="/products" className="mt-4 underline">Return to Gallery</a>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h1 className="text-3xl font-serif uppercase mb-10 tracking-widest">Your Cart</h1>
            
            <div className="space-y-8">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b pb-6">
                        <div className="flex gap-4">
                            <img
                                src={item.productImage || buildArtFallbackDataUri(item.productName)}
                                alt={item.productName}
                                loading="lazy"
                                decoding="async"
                                onError={(event) => setFallbackOnImageError(event, item.productName)}
                                className="w-20 h-20 object-cover"
                            />
                            <div>
                                <h2 className="uppercase font-bold">{item.productName}</h2>
                                <p className="text-stone-500">NPR {item.productPrice}</p>
                                <button onClick={() => removeFromCart(item._id)} className="text-xs text-red-500 mt-2">REMOVE</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => updateQuantity(item._id, -1)} className="px-2 border">-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, 1)} className="px-2 border">+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-between items-center">
                <button onClick={clearCart} className="text-stone-400 text-sm">CLEAR ALL</button>
                <div className="text-right">
                    <p className="text-sm uppercase text-stone-500">Total Amount</p>
                    <p className="text-2xl font-bold">NPR {getCartTotal()}</p>
                    <button
                        onClick={handleCheckout}
                        disabled={checkingOut}
                        className="mt-4 bg-[#5C2D91] text-white px-8 py-3 uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-[#4a2475] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CreditCard size={16} />
                        {checkingOut ? 'Processing...' : 'Pay with Khalti'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
