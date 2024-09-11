import Link from 'next/link';

import {useCart} from '@/context/CartContext';
import styles from '@/app/cart.module.css';

const Cart = () => {
    const {cartItems, removeFromCart, calculateTotal, clearCart, calculateCheckoutTotal} = useCart();

    const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

    const getOrderInformationHtml = (cartItems, totalAmount) => {
        let html = `
            <div style="font-family:Arial;">
              <h3>Order Information</h3>
              <div class="item" style="margin-bottom: 20px;">`;
        cartItems.forEach((cartItem) => {
            const productName = cartItem?.name;
            const productPrice = cartItem?.price.toFixed(2);
            const productImageUrl = cartItem?.image;

            html += `
              <div class="item" style="margin-bottom: 20px; display: flex; align-items: center;">
                <img style="max-width: 50px; margin-right: 10px;" src="${productImageUrl}" alt="${productName}">
                <p>${productName}&nbsp;</p>
                <span>Rs ${productPrice}</span>
              </div>`;
        });

        html += `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #ddd; margin-top: 20px; border-radius: 5px;" class="total">
                <label>Total:</label>
                <span>Rs ${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>`;

        return html;
    };

    const orderInformationHtml = getOrderInformationHtml(cartItems, calculateTotal());

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <title>Your Business Title</title>
        <script defer="defer" src="${BUNDLE_URL}"></script>
      <style>
        #checkout-btn {
            display: block;
            text-align: center;
            margin-bottom: 1em;
            font-size: .5em;
            padding: 0.8em;
            cursor: pointer;
            background-color: green;
            border-radius: .33rem;
            border-color: var(--wp--preset--color--contrast);
            border-width: 0;
            color: white;
            font-family: inherit;
            font-size: var(--wp--preset--font-size--small);
            font-style: normal;
            font-weight: 500;
            line-height: inherit;
            text-decoration: none;
            width: 200px;
        }
        </style>
    </head>
      <body>
    <div id="checkout" hidden></div>
    <button id="checkout-btn">Checkout</button>
    <script type="text/javascript">
        const options = {
            // user Info is optional. If provided, you can choose to prefill those information in checkout page
            userInfo: {
               name: "John Doe",
                email: "john@gmail.com",
                state: "Bagmati",
                country: "Nepal",
                zipcode: "44600",
                city: "Kathmandu",
                address: "Chabahil",
            },
            // insert papInfo, oprKey, insKey provided to you
            papInfo:"${process.env.NEXT_PUBLIC_PAP_INFO}",
            oprKey: "${process.env.NEXT_PUBLIC_OPR_KEY}",
            insKey: "${process.env.NEXT_PUBLIC_INS_KEY}",
            websiteDomain: "${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}",
            price: "${calculateTotal()}",
            businessName: "${process.env.NEXT_PUBLIC_BUSINESS_NAME}",
            imageUrl: "${process.env.NEXT_PUBLIC_LOGO_URL}",
            currency: "NPR",
            // provided attributes with value true will autofill in checkout page
            prefill: {
                name: true,
                email: true,
                state: true,
                city: true,
                address: true,
                zipcode: true,
                country: true
            },
            // provided attributes with value true will be disabled in checkout page. Note that you must only disable fields which are prefilled
            disableFields: {
                address: true,
                state: true, // address and state fields will be disabled in checkout page
            },
            // redirection callback url when payment is either success or fail
             callbackUrl: {
                successUrl:  "${process.env.NEXT_PUBLIC_SUCCESS_URL}",
                failUrl:  "${process.env.NEXT_PUBLIC_FAIL_URL}",
            },
            // brand theme color to display in checkout page
            themeColor: "#5662FF",
            orderInformationUI:  \`${orderInformationHtml}\`,
            onSuccess: (options) => {
                //you can receive options if needed
                // redirect to payment checkout page on success
               window.location.href = "./payment"
            },
            onError: (error) => {
               console.log("Error details:", error);
            },
        };
        document.getElementById('checkout-btn').onclick = function (e) {
            const getPay = new GetPay(options)
            getPay.initialize();
        }
    </script>
      </body>
    </html>
  `;

    return (
        <div className={styles.cartContainer}>
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <h2>Your cart is empty</h2>
                    <Link href="/">Go back to shopping</Link>
                </div>
            ) : (
                <>
                    <ul className={styles.cartList}>
                        {cartItems.map((item, idx) => (
                            <li key={idx} className={styles.cartItem}>
                                <div className={styles.productImage}>
                                    <img src={item?.image} alt={item?.name}/>
                                </div>
                                <div className={styles.productDetails}>
                                    <h2>{item?.name}</h2>
                                    <p>Rs {item?.price}</p>
                                    <button onClick={() => removeFromCart(item?.id)} className={styles.removeBtn}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.cartSummary}>
                        <h2>Total: Rs {calculateCheckoutTotal()}</h2>
                        <button onClick={clearCart} className={styles.clearBtn}>
                            Clear Cart
                        </button>
                        <div className={styles.checkoutBtn}>
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
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
