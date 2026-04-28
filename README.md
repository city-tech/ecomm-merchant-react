# E-Commerce Merchant Payment Application

A Next.js-based e-commerce merchant application with integrated payment processing through GetPay (NCHL). This application handles shopping cart management, secure payment processing, and payment verification.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Payment Flow](#payment-flow)
- [Key Features](#key-features)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Components & Pages](#components--pages)
- [State Management](#state-management)
- [Payment Integration](#payment-integration)
- [Chrome Private Network Access Fix](#chrome-private-network-access-fix)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This is an e-commerce platform that integrates with GetPay (NCHL's payment gateway) for secure online transactions. The application is built with:

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **State Management:** React Context API
- **Styling:** Tailwind CSS
- **UI Components:** React Hot Toast, React Loading Overlay

### Business Context

- **Business Name:** OneStop Shopping - Pokhara
- **Currency:** NPR (Nepali Rupees)
- **Payment Gateway:** GetPay (uat-bank-getpay.nchl.com.np)
- **Payment Integration:** Web Checkout (iframe-based)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │   Home/Shop    │  │  Cart Page     │  │  Checkout    │   │
│  │   (Product)    │  │  (Review Cart) │  │  (Review)    │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
│           │                  │                   │            │
│           └──────────────────┴───────────────────┘            │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │  Cart Context  │                        │
│                    │  (State Mgmt)  │                        │
│                    └────────────────┘                        │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │  Payment Page  │◄───────────┐           │
│                    │ (GetPay Modal) │            │           │
│                    └────────────────┘            │           │
└─────────────────────────────────────────────────┼────────────┘
                                                  │
                            ┌─────────────────────┘
                            │
                    ┌───────▼────────────────┐
                    │  GetPay Payment        │
                    │  Gateway (External)    │
                    │  (uat-bank-getpay...)  │
                    └───────┬─────────┬──────┘
                            │         │
                ┌───────────┘         └───────────┐
                │                                 │
        ┌───────▼──────────┐          ┌──────────▼────────┐
        │  Success Page    │          │  Fail Page       │
        │  (Verify Token)  │          │  (Error Display) │
        │  (Show Details)  │          │  (Retry Option)  │
        └──────────────────┘          └──────────────────┘
```

---

## Payment Flow

### Complete End-to-End Payment Journey

```
START
  │
  ├─► User Browses Products (Home/Product Page)
  │   └─► Click "Add to Cart" → Stored in CartContext
  │
  ├─► Navigate to Cart Page
  │   ├─► Review Items
  │   ├─► Adjust Quantities (Remove Items)
  │   └─► Click "Proceed to Checkout"
  │
  ├─► Checkout Page
  │   ├─► Display Order Summary
  │   │   ├─ Products with Images & Prices
  │   │   ├─ Total Amount Calculation
  │   │   └─ Order Information UI
  │   │
  │   ├─► Pre-fill User Information
  │   │   ├─ Name: "John Doe"
  │   │   ├─ Email: "john@gmail.com"
  │   │   ├─ Address: "Chabahil, Kathmandu"
  │   │   ├─ State: "Bagmati"
  │   │   ├─ City: "Kathmandu"
  │   │   ├─ Zipcode: "44600"
  │   │   └─ Country: "NPL"
  │   │
  │   └─► Click "Initiate Payment"
  │       └─► Loads GetPay Bundle Script
  │
  ├─► Payment Processing (GetPay Modal)
  │   ├─► Initialize GetPay Configuration
  │   │   ├─ PAP Info (Institution Credentials)
  │   │   ├─ OPR Key (Operator Key)
  │   │   ├─ Amount (Total Price)
  │   │   ├─ Theme Color: #5662FF
  │   │   └─ Callback URLs:
  │   │       ├─ Success: /SuccessPage
  │   │       └─ Fail: /FailPage
  │   │
  │   ├─► Display Payment Modal
  │   ├─► User Enters Payment Details
  │   ├─► Selects Payment Method
  │   └─► Completes Transaction
  │
  ├─► Post-Payment Handling
  │   │
  │   ├─ IF Payment Successful:
  │   │   ├─► Redirect to /SuccessPage
  │   │   ├─► Extract token from URL
  │   │   ├─► Decode Base64 Token
  │   │   ├─► Verify Payment with Backend
  │   │   │   └─ POST to /merchant-status with id & papInfo
  │   │   ├─► Display Success Message
  │   │   └─► Show Transaction Details:
  │   │       ├─ Status
  │   │       ├─ Amount
  │   │       ├─ Currency
  │   │       ├─ Client ID
  │   │       └─ Remarks
  │   │
  │   └─ IF Payment Failed:
  │       ├─► Redirect to /FailPage
  │       ├─► Display Error Message
  │       └─► Provide "Go Home" Button
  │
  └─► END
```

---

## Key Features

### 1. **Shopping Cart Management**
- Add products to cart with Context API
- Remove items from cart
- Calculate cart total dynamically
- View cart item count
- Clear entire cart

### 2. **Secure Payment Processing**
- Integration with GetPay (NCHL)
- Pre-filled user information form
- Customizable order information display
- Multiple currency support (NPR)
- Configurable theme colors

### 3. **Payment Verification**
- Token-based payment verification
- Base64 token decoding
- Backend merchant status verification
- Transaction details display

### 4. **User Experience**
- Loading overlay during payment initialization
- Toast notifications for feedback
- Responsive design with Tailwind CSS
- Error handling and retry mechanisms
- iframe breakout protection (3DS scenarios)

### 5. **Security**
- Environment variable configuration
- Private Network Access (PNA) support for Chrome
- HTTPS middleware for secure headers
- CORS configuration
- iframe escape detection

---

## Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ecomm-merchant-react
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Configuration](#configuration) section)

4. **Verify Installation**
   ```bash
   npm run lint
   ```

---

## Configuration

### Environment Variables (`.env`)

```env
# Business Information
BUSINESS_NAME=OneStop Shopping - Pokhara

# GetPay Credentials
NEXT_PUBLIC_PAP_INFO=eyJpbnN0aXR1dGlvbklkIjoiMTE5OSIsIm1pZCI6IjIyMjIyMjIyMjIyMjIyMiIsInRpZCI6IjMzMzMzMzMzIn0=
NEXT_PUBLIC_OPR_KEY=4fa4c6b9-3f91-43e5-9b4f-319f68187ba5
NEXT_PUBLIC_INS_KEY=""

# URLs and Endpoints
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000
NEXT_PUBLIC_BASE_URL=https://uat-bank-getpay.nchl.com.np/ecom-web-checkout/v1/secure-merchant/transactions
NEXT_PUBLIC_BUNDLE_URL=https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js
NEXT_PUBLIC_LOGO_URL=https://store.com/image.png

# Callback URLs (After Payment)
NEXT_PUBLIC_SUCCESS_URL=http://localhost:3000/SuccessPage
NEXT_PUBLIC_FAIL_URL=http://localhost:3000/FailPage
```

### Configuration Details

| Variable | Purpose | Example |
|----------|---------|---------|
| `BUSINESS_NAME` | Display name in checkout | OneStop Shopping - Pokhara |
| `NEXT_PUBLIC_PAP_INFO` | Base64 encoded institution credentials | eyJ... |
| `NEXT_PUBLIC_OPR_KEY` | Operator key for authentication | 4fa4c6b9... |
| `NEXT_PUBLIC_INS_KEY` | Institution key (optional) | "" |
| `NEXT_PUBLIC_WEBSITE_DOMAIN` | Your app's domain | http://localhost:3000 |
| `NEXT_PUBLIC_BASE_URL` | GetPay endpoint | https://uat-bank... |
| `NEXT_PUBLIC_BUNDLE_URL` | GetPay script CDN | https://minio.finpos... |
| `NEXT_PUBLIC_LOGO_URL` | Business logo | https://store.com/image.png |
| `NEXT_PUBLIC_SUCCESS_URL` | Post-payment success redirect | /SuccessPage |
| `NEXT_PUBLIC_FAIL_URL` | Post-payment failure redirect | /FailPage |

---

## Project Structure

```
ecomm-merchant-react/
├── app/
│   ├── layout.tsx              # Root layout wrapper
│   ├── globals.css             # Global styles
│   ├── cart.module.css         # Cart page styles
│   ├── product.module.css      # Product page styles
│   └── fonts/                  # Custom fonts
│
├── context/
│   ├── CartContext.tsx         # Cart state management (Context + hooks)
│   └── cartTypes.ts            # TypeScript interfaces & types
│
├── pages/
│   ├── _app.tsx                # Next.js app wrapper with CartProvider
│   ├── index.tsx               # Home page (products listing)
│   ├── Checkout.tsx            # Checkout page (GetPay initialization)
│   ├── payment.tsx             # Payment page (GetPay modal display)
│   ├── SuccessPage.tsx         # Success page (token verification)
│   └── FailPage.tsx            # Failure page (error display)
│
├── middleware.ts               # Next.js middleware (PNA headers)
├── server.js                   # HTTPS proxy server (dev only)
├── generate-cert.js            # SSL certificate generator
│
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── .env                        # Environment variables
├── .env.example                # Environment variables template
└── README.md                   # This file
```

---

## Components & Pages

### 1. **CartContext** (`context/CartContext.tsx`)

**Purpose:** Global state management for shopping cart

**Hooks & Methods:**
- `useCart()` - Hook to access cart context
- `addToCart(product)` - Add product to cart
- `removeFromCart(id)` - Remove product by ID
- `clearCart()` - Clear all items
- `calculateTotal()` - Get total price
- `calculateCheckoutTotal()` - Get formatted total (2 decimals)
- `getCartItemCount()` - Get number of items

**Usage:**
```typescript
const { cartItems, addToCart, removeFromCart, calculateTotal } = useCart();
```

### 2. **Home/Product Page** (`pages/index.tsx`)

**Purpose:** Display available products

**Features:**
- List products with images, names, prices
- "Add to Cart" button
- Navigation to cart page
- Mock product data

### 3. **Cart Page** 

**Purpose:** Review and manage cart items

**Features:**
- Display all cart items
- Show item images and prices
- Remove items individually
- Display cart total
- "Proceed to Checkout" button
- Empty cart message if no items

### 4. **Checkout Page** (`pages/Checkout.tsx`)

**Purpose:** Initialize GetPay payment gateway

**Features:**
- Pre-fill user information
- Display order summary with images
- Calculate and display total amount
- Configure GetPay options
- Load GetPay bundle script
- Handle loading state with overlay
- Error/success callbacks

**Key Configuration:**
```typescript
const options: PaymentOptions = {
    userInfo: { /* user details */ },
    price: calculateTotal(),
    papInfo: process.env.NEXT_PUBLIC_PAP_INFO,
    oprKey: process.env.NEXT_PUBLIC_OPR_KEY,
    callbackUrl: {
        successUrl: process.env.NEXT_PUBLIC_SUCCESS_URL,
        failUrl: process.env.NEXT_PUBLIC_FAIL_URL,
    },
    // ... other options
};
```

### 5. **Payment Page** (`pages/payment.tsx`)

**Purpose:** Display GetPay payment modal

**Features:**
- Inject GetPay bundle script
- Create checkout container
- Display payment modal to user
- Handle payment interactions

### 6. **Success Page** (`pages/SuccessPage.tsx`)

**Purpose:** Verify payment and display success confirmation

**Flow:**
1. Extract `token` from URL query parameter
2. Decode Base64 token to get `id` and `oprSecret`
3. Send POST request to `/merchant-status` for verification
4. Display transaction details if successful
5. Handle iframe breakout for 3DS scenarios

**Response Display:**
```
✅ Payment Successful
Status: [transaction status]
Amount: [amount in NPR]
Currency: NPR
Client ID: [client ID]
Remarks: [transaction remarks]
```

### 7. **Fail Page** (`pages/FailPage.tsx`)

**Purpose:** Display payment failure message

**Features:**
- Show error message
- Optional message from URL parameter
- "Go Home" button to return to shop
- iframe breakout protection

---

## State Management

### Cart Context Architecture

```
CartProvider (Root)
  │
  ├─► cartItems: Product[]
  │   └─ Stores all products added to cart
  │
  ├─► addToCart(product)
  │   └─ Appends product to cartItems
  │
  ├─► removeFromCart(id)
  │   └─ Filters out product by ID
  │
  ├─► clearCart()
  │   └─ Empties entire cart
  │
  ├─► calculateTotal()
  │   └─ Sum of all product prices
  │
  ├─► calculateCheckoutTotal()
  │   └─ Total with 2 decimal places
  │
  └─► getCartItemCount()
      └─ Length of cartItems array
```

### Usage in Components

```typescript
import { useCart } from '@/context/CartContext';

export default function MyComponent() {
    const { cartItems, addToCart } = useCart();
    
    const handleAddToCart = (product) => {
        addToCart(product);
    };
    
    return (
        // Component JSX
    );
}
```

---

## Payment Integration

### GetPay Integration Flow

#### 1. **Configuration**
```typescript
const options: PaymentOptions = {
    userInfo: {
        name: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
    },
    clientRequestId: string;        // Unique request ID
    papInfo: string;                // Base64 encoded institution info
    oprKey: string;                 // Operator authentication key
    price: number;                  // Payment amount
    currency: string;               // "NPR" for Nepali Rupees
    businessName: string;           // Display name
    imageUrl: string;               // Logo URL
    themeColor: string;             // Hex color (#5662FF)
    orderInformationUI: string;     // HTML for order display
    callbackUrl: {
        successUrl: string;         // Redirect on success
        failUrl: string;            // Redirect on failure
    },
    prefill: {                      // Auto-fill user form
        name: true,
        email: true,
        // ... other fields
    },
    disableFields: {                // Disable specific fields
        address: false,
        state: false,
    },
    onSuccess: () => void;          // Success callback
    onError: (error) => void;       // Error callback
};
```

#### 2. **Initialization**
```typescript
// Load GetPay script
const script = document.createElement('script');
script.src = BUNDLE_URL;
document.body.appendChild(script);

// When ready, initialize
const getpay = new window.GetPay(options);
getpay.initialize();
```

#### 3. **Payment Verification**
```
Success Response Token (URL parameter):
  Base64 String → Contains JSON:
    {
      "id": "transaction_id",
      "oprSecret": "secret_key"
    }

Verification Request (to /merchant-status):
  {
    "id": "transaction_id",
    "papInfo": "base64_institution_info"
  }

Response:
  {
    "message": "Payment Success",
    "data": {
      "status": "SUCCESS",
      "amount": 1000,
      "currency": "NPR",
      "clientId": "CLIENT123",
      "remarks": "Payment completed"
    }
  }
```

---

## Chrome Private Network Access Fix

### Problem
When payment gateway (HTTPS public) redirects to your app (HTTP localhost), Chrome blocks it with:
```
The connection is blocked because it was initiated by a public page to connect 
to devices or servers on your local network.
```

### Solution Components

#### 1. **Middleware** (`middleware.ts`)
```typescript
export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Private-Network": "true",
        "Access-Control-Allow-Origin": "*",
        // ... other CORS headers
      },
    });
  }
  
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Private-Network", "true");
  return response;
}
```

#### 2. **HTTPS Server** (`server.js`)
- Proxies HTTP requests to HTTPS
- Wraps localhost dev server in SSL
- Uses self-signed certificates

#### 3. **Certificate Generation** (`generate-cert.js`)
- Auto-generates SSL certificates on first run
- Stores in `.cert/` directory
- Valid for 365 days

### Configuration
See [HTTPS_PNA_FIX.md](HTTPS_PNA_FIX.md) for detailed setup instructions.

---

## Running the Application

### Development Mode

```bash
# Start with PNA fix (HTTPS + Middleware)
npm run dev

# Output:
# ✓ SSL certificates generated/loaded
# ✓ HTTPS server running on https://localhost:3001
# ✓ Next.js dev server on http://localhost:3000 (internal)
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Check code quality
npm run lint
```

---

## Workflow Example

### Step-by-Step User Journey

1. **Browse Products**
   ```
   User visits http://localhost:3001
   Sees product listings
   ```

2. **Add to Cart**
   ```
   Click "Add to Cart" on product
   Product added to CartContext
   Cart count updates
   ```

3. **View Cart**
   ```
   Navigate to Cart page
   See all items with prices
   Total calculated automatically
   ```

4. **Checkout**
   ```
   Click "Proceed to Checkout"
   GetPay configuration prepared
   Order summary displayed
   User information pre-filled
   ```

5. **Payment**
   ```
   Click "Initiate Payment"
   GetPay modal opens
   User enters payment details
   Completes transaction
   ```

6. **Success/Fail**
   ```
   If Success:
     - Redirected to SuccessPage
     - Token verified with backend
     - Transaction details shown
     - Cart cleared
   
   If Failed:
     - Redirected to FailPage
     - Error message displayed
     - Option to return and retry
   ```

---

## Type Definitions

### PaymentOptions Interface
```typescript
interface PaymentOptions {
    userInfo: {
        name: string;
        email: string;
        state: string;
        country: string;
        zipcode: string;
        city: string;
        address: string;
    };
    clientRequestId: string;
    papInfo?: string;
    allowBillingAddressFields: boolean;
    oprKey?: string;
    insKey?: string;
    websiteDomain?: string;
    price: number;
    businessName?: string;
    imageUrl?: string;
    baseUrl?: string;
    currency: string;
    prefill: { /* field booleans */ };
    disableFields: { /* field booleans */ };
    callbackUrl: {
        successUrl?: string;
        failUrl?: string;
    };
    themeColor: string;
    orderInformationUI: string;
    onSuccess: () => void;
    onError: (error: { error: string }) => void;
}
```

### Product Interface
```typescript
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    brand: string;
}
```

### CartContextType
```typescript
interface CartContextType {
    cartItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    calculateTotal: () => number;
    getCartItemCount: () => number;
    calculateCheckoutTotal: () => string;
}
```

---

## Troubleshooting

### Issue: "Token not found in URL" on Success Page
**Cause:** Payment gateway didn't pass token parameter
**Solution:** Check GetPay configuration's `successUrl` and callback settings

### Issue: "Invalid token structure" on Success Page
**Cause:** Token is corrupted or not properly Base64 encoded
**Solution:** Verify token encoding in payment gateway

### Issue: Payment modal not showing
**Cause:** GetPay bundle script not loading
**Solution:** 
- Check `NEXT_PUBLIC_BUNDLE_URL` in .env
- Verify internet connectivity
- Check browser console for script loading errors

### Issue: Chrome blocks navigation to localhost
**Cause:** Missing PNA headers
**Solution:** Run `npm run dev` to start HTTPS server with middleware

### Issue: "Port already in use"
**Cause:** Another process using port 3000 or 3001
**Solution:** 
```bash
# Kill existing process
lsof -ti:3001 | xargs kill -9

# Or run on different port
PORT=3002 npm run dev
```

### Issue: Self-signed certificate warnings
**Cause:** Expected behavior for development
**Solution:** Click "Advanced" → "Proceed to localhost (unsafe)"

### Issue: "EACCES: permission denied" on certificate generation
**Cause:** No write permissions in project directory
**Solution:** Check file permissions or run with appropriate privileges

---

## Best Practices

### Security
- ✅ Never commit `.env` file with real credentials
- ✅ Use environment variables for sensitive data
- ✅ Verify tokens on server-side
- ✅ Implement rate limiting on payment endpoints
- ✅ Use HTTPS in production with proper SSL certificates

### Performance
- ✅ Lazy load GetPay script on payment page
- ✅ Implement loading states during payment
- ✅ Cache product data appropriately
- ✅ Minimize bundle size

### User Experience
- ✅ Show clear loading indicators
- ✅ Provide meaningful error messages
- ✅ Allow payment retry on failure
- ✅ Display transaction details on success
- ✅ Responsive design for mobile

### Code Quality
- ✅ Use TypeScript for type safety
- ✅ Follow component-based architecture
- ✅ Keep state management centralized
- ✅ Use environment variables for configuration
- ✅ Handle errors gracefully

---

## Production Deployment

### Before Deploying

1. **Update Environment Variables**
   - Use production GetPay credentials
   - Update domain URLs
   - Use production SSL certificates

2. **Security**
   - Remove `Access-Control-Allow-Origin: *`
   - Restrict to trusted domains only
   - Implement server-side verification
   - Add rate limiting

3. **Configuration**
   - Update `NEXT_PUBLIC_WEBSITE_DOMAIN`
   - Update success/fail callback URLs
   - Configure business information

4. **Testing**
   - Test complete payment flow
   - Verify token verification
   - Test failure scenarios
   - Check mobile responsiveness

### Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed (proper CA)
- [ ] CORS headers configured for production
- [ ] Payment gateway endpoints verified
- [ ] Success/fail pages tested
- [ ] Error logging implemented
- [ ] Database connection verified (if applicable)
- [ ] Performance optimizations applied
- [ ] Security audit completed
- [ ] User acceptance testing done

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.2.4 | React framework |
| react | ^18 | UI library |
| react-dom | ^18 | DOM rendering |
| react-hot-toast | ^2.4.1 | Notifications |
| react-loading-overlay-ts | ^2.0.2 | Loading overlay |
| tailwindcss | ^3.4.1 | Styling |
| typescript | ^5 | Type safety |

---

## Learning Resources

- [GetPay Documentation](https://bank.nchl.com.np)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Chrome Private Network Access](https://wicg.github.io/private-network-access/)

---

## Support & Contribution

For issues or questions:
1. Check the troubleshooting section
2. Review GetPay documentation
3. Check Next.js official docs
4. Contact support team

---

## License

[Add your license information here]

---

## Authors

- Development Team
- Last Updated: April 2026

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
            userInfo: {
                name: "John Doe",
                email: "john@gmail.com",
                state: "Bagmati",
                country: "Nepal",
                zipcode: "44600",
                city: "Kathmandu",
                address: "Chabahil",
            },
            clientRequestId:"CLIENT123",
            papInfo: process.env.NEXT_PUBLIC_PAP_INFO,
            oprKey: process.env.NEXT_PUBLIC_OPR_KEY,
            insKey: process.env.NEXT_PUBLIC_INS_KEY,
            websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
            price: calculateTotal(),
            businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME,
            imageUrl: process.env.NEXT_PUBLIC_LOGO_URL,
            currency: "NPR",
            prefill: {
                name: true,
                email: true,
                state: true,
                city: true,
                address: true,
                zipcode: true,
                country: true
            },
            disableFields: {
                address: true,
                state: true,
            },
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
