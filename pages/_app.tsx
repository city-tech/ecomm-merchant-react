import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import '@/app/cart.module.css';
import {CartProvider} from '@/context/CartContext';

function MyApp({Component, pageProps}) {
    return (
        <>
        <Toaster position="top-center" reverseOrder={false} />
        <CartProvider>
            <Component {...pageProps} />
        </CartProvider>
        </>
    );
}

export default MyApp;
