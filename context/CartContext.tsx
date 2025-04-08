import { createContext, useState, useContext, ReactNode } from 'react';
import {CartContextType, Product} from "@/context/cartTypes";


const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCartItems((prevItems) => [...prevItems, product]);
    };

    const removeFromCart = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const calculateCheckoutTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    const getCartItemCount = () => {
        return cartItems.length;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                calculateTotal,
                getCartItemCount,
                calculateCheckoutTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};