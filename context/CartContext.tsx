import {createContext, useState, useContext} from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => [...prevItems, product]);
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach((item) => {
            total += item?.price;
        });
        return total;
    };

    const calculateCheckoutTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    const getCartItemCount = () => {
        return cartItems.length;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            calculateTotal,
            getCartItemCount,
            calculateCheckoutTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
