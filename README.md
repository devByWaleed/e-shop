# Case Study - Multi-Vendor E-commerce Platform

## Overview

Meet **Zenvio**.

**Name meaning:**
- **Zen** = smooth, effortless experience
- **vio** = via/through, connecting buyers and sellers

As per its name, it is a multi-vendor e-commerce platform where buyers can find their favorite products and can connect with its respective seller.

## Goals of the Project

The goal of this platform is to provide a marketplace where buyers can find the products according to their taste and seller can sell products seamlessly. A marketplace where the payment transactions are secure n safe and users can contact with each other.

## System Architecture Overview

### System Architecture Diagram

```mermaid
graph TD
  %% Clients
  subgraph Clients
    U[Buyer / Customer]
    S[Seller]
    A[Admin]
  end

  FE["Frontend (React + Redux)"]
  BE["Backend API (Express.js)"]

  subgraph BackendModules [Backend Modules]
    Auth["Authentication & Authorization"]
    Products["Product & Catalog"]
    Shops["Shop & Seller Management"]
    Orders["Order Processing & Tracking"]
    Events["Flash Events"]
    Messaging["Conversations & Messages (Socket.io)"]
    Payments["Payment Integration (Stripe)"]
    Uploads["Image Uploads (Cloudinary + Multer)"]
    Emails["Transactional Emails"]
  end

  DB["MongoDB + Mongoose"]
  StripeExternal["Stripe"]
  CloudinaryExternal["Cloudinary"]
  EmailService["SMTP / Nodemailer"]
  Vercel["Vercel Hosting"]

  %% Connections
  U --> FE
  S --> FE
  A --> FE
  FE --> BE
  FE -. "WebSocket" .-> Messaging

  BE --> Auth & Products & Shops & Orders & Events & Messaging & Payments & Uploads & Emails
  Products --> DB
  Shops --> DB
  Orders --> DB
  Events --> DB
  Auth --> DB
  Messaging --> DB
  Uploads --> DB
  Payments --> StripeExternal
  Uploads --> CloudinaryExternal
  Emails --> EmailService
  BE --> Vercel
  FE --> Vercel

  %% Styles with brighter text
  classDef clients fill:#cce5ff,stroke:#333,stroke-width:1px,color:#003366,rx:8,ry:8;
  classDef frontend fill:#d4edda,stroke:#333,stroke-width:1px,color:#064420,rx:8,ry:8;
  classDef backend fill:#f8f9fa,stroke:#333,stroke-width:1px,color:#212529,rx:8,ry:8;
  classDef db fill:#ffeeba,stroke:#333,stroke-width:1px,color:#7a4d00,rx:8,ry:8;
  classDef external fill:#f9c2ff,stroke:#333,stroke-width:1px,color:#660066,rx:8,ry:8;
  classDef deploy fill:#e2e3e5,stroke:#333,stroke-width:1px,color:#111,rx:8,ry:8;

  class U,S,A clients;
  class FE frontend;
  class BE,Auth,Products,Shops,Orders,Events,Messaging,Payments,Uploads,Emails backend;
  class DB db;
  class StripeExternal,CloudinaryExternal,EmailService external;
  class Vercel deploy;
```

---

## Key Features

### Multi-Role User System

This platform provide 3 main User roles according to the marketplace.

- **Buyer**: Saving products, Add to cart, messaging, order tracking
- **Seller**: Product management, Order status tracking, messaging
- **Admin**: Panel to keep track of Buyers, Sellers, Products, Orders, Events and messaging.

### Product Management & Shopping

- **Product listings**: A grid-based product listing with support of backward navigation links **Breadcrumb** in Product Details page.
- **Cart & checkout**: A safe Cart component to keep track of items along with secure checkout procedure featuring Cash-on-Delivery and Stripe payment gateway.
- **Search & filtering**: A fast & robust search bar with a sections displays matching product names which is support by Category-based filter.

### Payment Processing

- **Secure transactions**: Integrated secure payment process for Stripe account done by integrating Checkout sessions and Web-hook.

### Real-Time Messaging

- **Buyer ↔ Seller ↔ Admin Chat**: This market place allow one-to-one chatting between Buyer ↔ Seller, Buyer ↔ Admin and Seller ↔ Admin.
- **Online Status**: Integrated green dot based online status signaling which is active on the platform at the moment.

### Seller Dashboard Features

- **Dashboard**
  - Seller can see the overview of the shop in dashboard
- **Product Management**
  - Seller can see all products and all flash-events products.
- **Order Management**
  - Seller can track all orders + change the order status.
- **Discount Codes**
  - Seller can add discount by creating a coupon code for any specific product.
- **Refunds**
  - Seller can accept the Refund request by user and apply it on specific order.
- **Shop Update**
  - Seller can update the profile and shop details.
- **Chatting**
  - Seller can engage with both buyers and Admin.

### API Architecture

**Buyer Auth and profile**
- `/api/user`

**Seller Auth and profile**
- `/api/seller`

**Messages & Conversations**
- `/api/conversation`
- `/api/message`

**Product Management**
- `/api/product`
- `/api/event`
- `/api/coupon`

**Order Management**
- `/api/order`

**Admin Panel**
- `/api/admin`

### Brand Value Propositions

- **Scalability**: The market place can be scale for more categories products and payment methods.
- **Security**: Accepts only HTTP cookies to prevent XSS attacks.
- **Performance**: Uses global state management & SEO practices to maintain the website performance.

## Tech Stack

### Backend

**Frameworks & libraries**
- **Node.js**: For creating & running JavaScript in local setup
- **Express.js**: Light Node.js framework for backend logic.
- **MongoDB**: NOSQL database for storing data into scalable document.
- **JWT**: Secure user authentication & authorization based on tokens set in cookies.
- **Bcrypt**: Use for hashing passwords before storing to database.
- **Node Mailer**: A package use to send emails.
- **Stripe**: Payment gateway for secure transactions

### Frontend

**Frameworks & libraries**
- **React with Tailwind CSS**: For UI Designing.
- **Redux Toolkit**: For Global state management.
- **Socket Client**: For integrating socket chat feature in frontend.
- **Vite**: Light-weight frontend app package for dev servers

### File & Media Handling

- **Image uploads**: Handle by Cloudinary cloud storage with feature to delete old images before updating the profile.
- **Cloud storage**: Handles by Multer's storage manager.

### Real-Time Communication

- **SocketIO**: SocketIO server manages real-time chatting along with image upload feature to Cloudinary.

### Development & Deployment Tools

- **Dotenv**: Uses env environmetal variables to store private API keys and credentials.
- Uses Express server with nodemon to automatically restart server after saving a file in local machine.
- **Vercel** cloud platform to upload client-side UI and backend servers.

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Image Uploading | Use local folder firstly, then integrate Cloudinary to upload images to desired location. |
| Redux State Reset | Call Actions inside React useEffect hook to load data in App.jsx and to necessary file to ensure data remains save. |
| Send Data and Model Mismatch | Correctly write queries to store data that matches the database model. |

## Database Design
```mermaid
erDiagram
    users {
        string _id PK
        string name
        string email
        string password
        number phoneNumber
        string role
        string avatar
        array addresses
        datetime createdAt
        datetime updatedAt
    }
    
    sellers {
        string _id PK
        string name
        string email
        string password
        number phoneNumber
        number zipCode
        string role
        string avatar
        string address
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    products {
        string _id PK
        string name
        array description
        string category
        string tags
        number originalPrice
        number discountPrice
        number stock
        array images
        string shopId FK
        object shop
        number soldOut
        number ratings
        array reviews
        datetime createdAt
        datetime updatedAt
    }
    
    events {
        string _id PK
        string name
        array description
        string category
        datetime start_Date
        datetime finish_Date
        string status
        string tags
        number originalPrice
        number discountPrice
        number stock
        array images
        string shopId FK
        object shop
        number soldOut
        datetime createdAt
        datetime updatedAt
    }
    
    coupons {
        string _id PK
        string name
        number discountPercentage
        number minAmount
        number maxAmount
        string shopId FK
        string selectedProduct FK
        datetime createdAt
        datetime updatedAt
    }
    
    orders {
        string _id PK
        array cart
        object shippingAddress
        string userId FK
        number totalPrice
        string status
        object paymentInfo
        datetime paidAt
        datetime createdAt
        datetime deliveredAt
        datetime updatedAt
    }
    
    conversations {
        string _id PK
        string groupTitle
        array members
        datetime createdAt
        datetime updatedAt
        string lastMessage
        string lastMessageId FK
    }
    
    messages {
        string _id PK
        string conversationId FK
        string sender
        string text
        array images
        datetime createdAt
        datetime updatedAt
    }

    users ||--o{ orders : "has"
    sellers ||--o{ products : "sells"
    sellers ||--o{ events : "organizes"
    sellers ||--o{ coupons : "offers"
    products ||--o{ coupons : "has"
    conversations ||--o{ messages : "contains"
    conversations ||--|| messages : "last message"
```
---

## Application Flow Diagram
```mermaid
flowchart TB
    %% Frontend Layer
    subgraph FrontendLayer["Frontend Layer"]
        subgraph UserInterface["User Interface"]
            
            CustomerUI["Buyer Interface<br/>• Product Discovery<br/>• Cart Management<br/>• Checkout Process<br/>• Profile Update<br/>• Messaging"]
            
            SellerUI["Seller Dashboard<br/>• Product Management<br/>• Order Processing<br/>• Messaging"]

            AdminUI["Admin Panel<br/>• User Management<br/>• Seller Management<br/>• Order Management<br/>• Product & Event Management"]
        end
        
        subgraph ReactComponents["React Components"]
            ProductDetails["ProductDetails Component"]
            UserInbox["UserInbox Component"]
            DashboardMessages["DashboardMessages Component"]
        end
        
        subgraph StateManagement["State Management"]
            ReduxStore["Redux Store<br/>• User State<br/>• Seller State<br/>• Product State<br/>• Event State<br/>• Order State<br/>• Cart/Wishlist<br/>• Admin State"]
        end
    end
    
    %% Communication Layer
    subgraph CommunicationLayer["Communication Layer"]
        HTTPREST["HTTP/REST"]
        CORS["CORS Middleware<br/>Credentials: true"]
        Auth["JWT Cookie Authentication"]
        SocketIO["Socket.io WebSocket"]
    end
    
    %% Backend Layer
    subgraph BackendLayer["Backend Layer"]
        ExpressServer["Express.js Server<br/>API Gateway Port 4000"]
        subgraph RouteModules["Route Modules"]
            UserRoutes["/api/user/<br/>Authentication & Profiles"]
            SellerRoutes["/api/seller/<br/>Shop Management"]
            ProductRoutes["/api/product/<br/>Catalog Operations"]
            OrderRoutes["/api/order/<br/>Order Processing"]
            ConversationRoutes["/api/conversation/<br/>Chat Management"]
            MessageRoutes["/api/message/<br/>Message Operations"]
            CouponRoutes["/api/coupon/<br/>Coupons"]
            EventRoutes["/api/event/<br/>Events"]
        end
    end
    
    %% Data Layer
    subgraph DataLayer["Data Layer"]
        MongoDB["MongoDB Database<br/>Document Storage"]
        Cloudinary["Cloudinary<br/>Image Storage"]
        Stripe["Stripe API<br/>Payment Processing"]
    end
    
    %% Connections: Frontend -> Communication
    CustomerUI --> CORS
    SellerUI --> CORS
    AdminUI --> CORS
    
    ProductDetails --> ReduxStore
    UserInbox --> SocketIO
    DashboardMessages --> SocketIO
    
    %% Connections: Communication -> Backend
    CORS --> Auth
    Auth --> ExpressServer
    SocketIO -.-> MessageRoutes
    
    %% Connections: Backend -> Routes
    ExpressServer --> UserRoutes
    ExpressServer --> SellerRoutes
    ExpressServer --> ProductRoutes
    ExpressServer --> OrderRoutes
    ExpressServer --> ConversationRoutes
    ExpressServer --> MessageRoutes
    ExpressServer --> CouponRoutes
    ExpressServer --> EventRoutes
    
    %% Connections: Backend -> Data
    UserRoutes --> MongoDB
    SellerRoutes --> MongoDB
    ProductRoutes --> MongoDB
    OrderRoutes --> MongoDB
    ConversationRoutes --> MongoDB
    MessageRoutes --> MongoDB
    MessageRoutes --> Cloudinary
    OrderRoutes --> Stripe
    CouponRoutes --> MongoDB
    EventRoutes --> MongoDB
    
    %% Real-time Flow
    UserInbox -.->|"Real-time Messages"| DashboardMessages
```

---

### User Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant UserController
    participant Database
    participant EmailService
    participant Cloudinary

    %% Register Account
    User->>Frontend: Register Account
    Frontend->>UserController: POST /user/register
    UserController->>UserController: createActivationToken()
    UserController->>EmailService: Send activation email
    UserController->>Cloudinary: Upload avatar
    UserController-->>Frontend: Registration success

    %% Click Activation Link
    User->>Frontend: Click activation link
    Frontend->>UserController: POST /user/activation
    UserController->>Database: User.create()
    UserController-->>Frontend: User created + Auth token

    %% Login
    User->>Frontend: Login
    Frontend->>UserController: POST /user/login
    UserController->>Database: User.findOne({email})
    UserController->>UserController: bcrypt.compare()
    UserController-->>Frontend: Login success + Token

    %% Post-login Activities
    User->>Frontend: Browse products
    User->>Frontend: Add to cart / wishlist
    User->>Frontend: Send message to seller / admin
```

---

### Seller Flow
```mermaid
sequenceDiagram
    participant Seller
    participant Frontend
    participant sellerController
    participant Database
    participant EmailService
    participant Cloudinary

    %% Registration
    Seller->>Frontend: Register Shop
    Frontend->>sellerController: POST /seller/seller-register
    sellerController->>Database: seller.findOne(email)
    sellerController->>Cloudinary: Upload shop avatar
    sellerController->>EmailService: Send activation email

    %% Activation
    Seller->>Frontend: Click activation link
    Frontend->>sellerController: POST /seller/activation
    sellerController->>Database: Shop.create()

    %% Login
    Seller->>Frontend: Login to shop
    Frontend->>sellerController: POST /seller/seller-login
    sellerController->>Database: seller.findOne(email)
    sellerController->>sellerController: bcrypt.compare()
    sellerController->>Frontend: Set cookie (login success)

    %% Post-login actions
    Seller->>Frontend: Manage products/events
    Seller->>Frontend: Process orders
    Seller->>Frontend: Update shop profile
    Seller->>Frontend: Handle customer / admin messages
```
---

### Admin Flow
```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant adminController
    participant Database

    %% Admin Login
    Admin->>Frontend: Login as Admin
    Frontend->>adminController: POST /admin/admin-login
    adminController->>ENV: (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASS)
    adminController->>Frontend: Admin login success

    %% View All Users
    Admin->>Frontend: View all users
    Frontend->>adminController: GET /admin/admin-users
    adminController->>Database: UserModel.find().sort({createdAt: -1})
    adminController->>Frontend: Users list

    %% View All Sellers
    Admin->>Frontend: View all sellers
    Frontend->>adminController: GET /admin/admin-sellers
    adminController->>Database: SellerModel.find().sort({createdAt: -1})
    adminController->>Frontend: Sellers list

    %% Delete User
    Admin->>Frontend: Delete user
    Frontend->>UserController: DELETE /admin/delete-user-by-id/:id
    UserController->>Database: UserModel.findByIdAndDelete()
    UserController->>Frontend: User deleted

    %% Delete Seller
    Admin->>Frontend: Delete seller
    Frontend->>adminController: DELETE /admin/delete-seller-by-id/:id
    adminController->>Database: SellerModel.findByIdAndDelete()
    adminController->>Frontend: Seller deleted
```
---

## Best Practices

### Authentication & Security

- **JWT**: Implemented HTTP only cookies to prevent XSS attacks.
- **Data encryption**: Implemented password hashing to prevent credential exposure.
- **Role Based Authentication**: Implemented Private routes with role based authentication for smooth workflow and prevents un-necessary redirection.

### Component Architecture

- **Reusable components**: Used re-usable React components to main Folder structure easy to read and maintain.
- **State Management**: Implemented redux reducers and actions for clean data management all across the website.
- **Protected Routes**: Implement protected routes for all Users (Buyers, Sellers & Admin) to prevent un-necessary navigation.

### Error Handling & User Experience

- **Friendly error messages**: Integrated React-Hot-Toast to display user friendly error messages.
- **Logging & monitoring**: Implemented logic to prevent duplicates across sections like Cart and Wish-list for smooth User Experience.