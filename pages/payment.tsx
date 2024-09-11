import {useEffect} from "react";

const Payment = () => {

    const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = BUNDLE_URL;
        script.async = true;
        script.onload = () => console.log('GetPay script loaded successfully');
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div style={styles.container}>
            <div id="checkout"></div>
        </div>
    );
};

export default Payment;
