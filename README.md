This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 1. Prerequisites

- [NodeJs 18.18 or later.](https://nodejs.org/en/) -JavaScript runtime built on Chrome's V8 JavaScript engine
- [Yarn](https://yarnpkg.com/cli) - Node package manager

## 2. Installation

On the command prompt run the following commands:

```bash
 $ git clone https://krishnatimilsina@bitbucket.org/Citytech_global/ecomm-merchant-react.git
 $ cd ecomm-merchant-react
 $ cp .env.example .env 
 $ yarn install or npm install
```

## 3. Start the application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Integration Steps
### Step 1: Create a `cart` page
```bash
const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

const getOrderInformationHtml = (cartItems, totalAmount) => {
        let html = `
            <div>
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
    
const initializeGetPay = () => {
        setIsLoading(true);
        const options = {
            mid: process.env.NEXT_PUBLIC_MID,
            tid: process.env.NEXT_PUBLIC_TID,
            username: process.env.NEXT_PUBLIC_USERNAME,
            password: process.env.NEXT_PUBLIC_PASSWORD,
            websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
            amount: calculateTotal(),
            businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME,
            imageUrl: process.env.NEXT_PUBLIC_LOGO_URL,
            currency: "NPR",
            callbackUrl: {
                successUrl: process.env.NEXT_PUBLIC_SUCCESS_URL,
                failUrl: process.env.NEXT_PUBLIC_FAIL_URL,
            },
            themeColor: "#5662FF",
            orderInformationUI: `${orderInformationHtml}`,
            onSuccess: (options) => {
                window.location.href = "./payment";
            },
            onError: (error) => {
                setIsLoading(false);
                toast?.error(error?.error)
                console.log("Error details:", error);
            },
        };

        const getPay = new window.GetPay(options);
        getPay.initialize();
    };

    useEffect(() => {
        if (cartItems?.length > 0) {
            const script = document.createElement('script');
            script.src = BUNDLE_URL;
            script.async = true;
            script.onload = () => console.log('GetPay script loaded successfully');
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);
```
```bash
<div className={styles.checkoutContainer}>
   <div id="checkout" hidden></div>
   <button id="checkout-btn" className={styles.checkoutBtn} onClick={initializeGetPay}>Checkout</button>
</div>
```
### Step 2: Create a `payment` page
```bash
const BUNDLE_URL = process.env.NEXT_PUBLIC_BUNDLE_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';
    
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
```
```bash
<div style={styles.container}>
   <div id="checkout"></div>
</div>
```
