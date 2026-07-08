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
                product: product._id,
                quantity
            });
            amount += unitPrice * quantity;
        }

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);

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
                product: product._id,
                quantity
            });

            productData.push({
                name: product.name,
                price: unitPrice,
                quantity
            });
            amount += unitPrice * quantity;
        }

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);

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
                        status: "Paid",
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



// Get Orders by UserID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userID = req.userID;

        const orders = await OrderModel.find({
            user: userID,
            $or: [{ "paymentInfo.type": "COD" }, { status: "Paid" }, { "paymentInfo.status": "Paid" }]
        }).sort({ createdAt: -1 });

        return res.json({ success: true, orders });
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