const Payment22 = () => {
    const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <title>Your Business Title</title>
        <script defer="defer" src="${BUNDLE_URL}"></script>
      </head>
      <body>
        <div id="checkout"></div>
      </body>
    </html>
  `;

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        },
        iframe: {
            width: '100%',
            height: '100%',
            border: 'none',
        },
    };

    return (
        <div style={styles.container}>
            <>
                <iframe
                    title="Payment Webview"
                    allowpaymentrequest={"true"}
                    srcDoc={htmlContent}
                    // data-base-url="http://localhost:3000"
                    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation">
                </iframe>
            </>
        </div>
    );
};

export default Payment22;
