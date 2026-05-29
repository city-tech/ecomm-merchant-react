
import {useEffect} from "react";

const Payment = () => {

    const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js';

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

   useEffect(() => {
    const sessionLink = window.localStorage.getItem("sessionLink");

    if (!sessionLink || !BUNDLE_URL) return;

    const sessionScript = document.createElement("script");
    const bundleScript = document.createElement("script");

    sessionScript.src = sessionLink;
    sessionScript.async = true;

    bundleScript.src = BUNDLE_URL;
    bundleScript.async = true;

    const handleBundleLoad = () => {
        console.log("Bundle script loaded");
        (window as any).loadMPGSScript?.();
    };

    const handleSessionLoad = () => {
        console.log("Session script loaded");

        bundleScript.onload = handleBundleLoad;

        document.body.appendChild(bundleScript);
    };

    sessionScript.onload = handleSessionLoad;

    document.body.appendChild(sessionScript);

    return () => {
        sessionScript.onload = null;
        bundleScript.onload = null;

        if (document.body.contains(sessionScript)) {
            document.body.removeChild(sessionScript);
        }

        if (document.body.contains(bundleScript)) {
            document.body.removeChild(bundleScript);
        }
    };
}, []);

    return (
        <div style={styles.container}>
            <div id="checkout"></div>
        </div>
    );
};

export default Payment;
