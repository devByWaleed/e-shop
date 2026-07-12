import OrderModel from "../models/Orders.js";
import UserModel from "../models/Users.js";
import ProductModel from "../models/Products.js";
import stripe from "stripe"

const getProductUnitPrice = (product) => {
    const price = Number(product?.discountPrice ?? product?.originalPrice ?? 0);
    return Number.isFinite(price) ? price : 0;
};

const getQuantity = (value) => {
    const quantity = Number(value ?? 1);
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userID = req.userID;

        if (!address || !Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        let amount = 0;
        const normalizedItems = [];

        for (const item of items) {
            const product = await ProductModel.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            const quantity = getQuantity(item.quantity);
            const unitPrice = getProductUnitPrice(product);

            normalizedItems.push({
                product: product,
                quantity,
                seller: item.shopId
            });
            amount += unitPrice * quantity;
        }

        await OrderModel.create({
            cart: normalizedItems,
            shippingAddress: address,
            user: userID,
            totalPrice: amount,
            status: "Processing",
            paymentInfo: {
                type: "COD",
                status: "Pending"
            }
        });

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userID = req.userID;
        const frontendUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

        if (!address || !Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let productData = [];
        let amount = 0;
        const normalizedItems = [];

        for (const item of items) {
            const product = await ProductModel.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            const quantity = getQuantity(item.quantity);
            const unitPrice = getProductUnitPrice(product);

            normalizedItems.push({
                product: product,
                quantity,
                seller: item.shopId
            });

            productData.push({
                name: product.name,
                price: unitPrice,
                quantity
            });
            amount += unitPrice * quantity;
        }

        const order = await OrderModel.create({
            cart: normalizedItems,
            shippingAddress: address,
            user: userID,
            totalPrice: amount,
            status: "Processing",
            paymentInfo: {
                type: "Online",
                status: "Pending"
            }
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    // Stripe is charging almost nothing
                    unit_amount: Math.floor(item.price * 1.02 * 100)
                },
                quantity: item.quantity
            }
        });

        // Create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontendUrl}/success`,
            cancel_url: `${frontendUrl}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userID
            }
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Stripe Webhooks to verify payments action : /stripe
export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body, // This MUST be the raw buffer
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("❌ Webhook Signature Failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId, userID } = session.metadata;

        try {
            if (orderId && userID) {
                // Use Promise.all to run both updates in parallel for speed
                await Promise.all([
                    OrderModel.findByIdAndUpdate(orderId, {
                        status: "processing",







                        paymentInfo: {
                            type: "Online",
                            status: "Paid"
                        }
                    }),
                    UserModel.findByIdAndUpdate(userID, { cartItems: {} })
                ]);
                console.log(`✅ Order ${orderId} updated successfully.`);
            }
        } catch (dbError) {
            console.error("❌ Database Update Failed:", dbError.message);
            // Return a 500 so Stripe knows to retry the webhook later
            return res.status(500).json({ success: false });
        }
    }

    res.status(200).json({ received: true });
};



// Get Orders by UserID : /api/order/user-orders
export const getUserOrders = async (req, res) => {
    try {
        const userID = req.userID;

        const orders = await OrderModel.find({
            user: userID,
        }).sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Get Orders by UserID : /api/order/shop-orders
export const getShopOrders = async (req, res) => {
    try {
        const sellerID = req.sellerID;

        const shopOrders = await OrderModel.find({
            "cart.seller": sellerID,
        }).sort({ createdAt: -1 });

        return res.json({ success: true, shopOrders });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Get all Orders ( for seller / admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({
            $or: [{ "paymentInfo.type": "COD" }, { status: "Paid" }, { "paymentInfo.status": "Paid" }]
        }).sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Update Order Status: /api/order/update-order-status/:id
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const stockAlreadyDepleted =
            order.status === "Transferred to delivery partner" || order.status === "Delivered";

        const isNowDepletingStatus =
            req.body.status === "Transferred to delivery partner" || req.body.status === "Delivered";

        // Deplete stock exactly once, whichever of the two statuses hits first
        if (isNowDepletingStatus && !stockAlreadyDepleted) {
            for (const item of order.cart) {
                await updateProductStock(item.product?._id || item.product, item.quantity);
            }
        }

        order.status = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
            if (order.paymentInfo.type === "COD") {
                order.paymentInfo.status = "Paid";
            }
        }

        await order.save({ validateBeforeSave: false });

        return res.json({ success: true, message: "Order status updated successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

async function updateProductStock(productId, qty) {
    const product = await ProductModel.findById(productId);
    if (product) {
        product.stock = Math.max(0, product.stock - qty);
        product.soldOut += qty;
        await product.save({ validateBeforeSave: false });
    }
}


// Update Order Status: /api/order/order-refund/:id
export const updateRefund = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        order.status = req.body.status

        await order.save({ validateBeforeSave: false });

        return res.json({ success: true, message: "Order refund request successfully!", order });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}



// Accept Refund : /api/seler/logout/:id
export const refundAccept = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        order.status = req.body.status

        if (req.body.status === "Processing refund") {
            for (const item of order.cart) {
                await updateRefundStock(item.product?._id || item.product, item.quantity);
            }
        }

        await order.save({ validateBeforeSave: false });

        return res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

async function updateRefundStock(productId, qty) {
    const product = await ProductModel.findById(productId);
    if (product) {
        product.stock = Math.max(0, product.stock + qty);
        product.soldOut -= qty;
        await product.save({ validateBeforeSave: false });
    }
}