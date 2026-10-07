import OrderModel from "../models/Orders.js";
import UserModel from "../models/Users.js";
import ProductModel from "../models/Products.js";
import { getCouponDiscount } from "../config/coupon.js";
import stripe from "stripe"


// Statuses at which stock is taken from the product
const STOCK_DEPLETED_STATUSES = ["Transferred to delivery partner", "Delivered"];

// The status your seller "accept refund" button sends.
// It is the same status that already puts the stock back. Confirm it with:
//   grep -rn "Processing refund" frontend/src
const REFUND_ACCEPT_STATUS = "Processing refund";


const getProductUnitPrice = (product) => {
    const price = Number(product?.discountPrice ?? product?.originalPrice ?? 0);
    return Number.isFinite(price) ? price : 0;
};

const getQuantity = (value) => {
    const quantity = Number(value ?? 1);
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};


const FEE_RATE = 0.02;   // 2% added to online payments

// Money is calculated in whole cents to avoid numbers like 59.97000000000001
const toCents = (amount) => Math.round(amount * 100);

// Splits the cart into one group per shop and prices every group
const buildShopOrderDocs = ({ normalizedItems, address, userID, coupon, discount, paymentInfo, feeRate }) => {
    const groups = {};
    for (const item of normalizedItems) {
        if (!groups[item.seller]) groups[item.seller] = [];
        groups[item.seller].push(item);
    }

    return Object.entries(groups).map(([shopId, cart]) => {
        const subtotalCents = cart.reduce(
            (sum, item) => sum + toCents(getProductUnitPrice(item.product)) * item.quantity,
            0
        );

        // A coupon belongs to ONE shop, so only that shop's order gets the discount
        const discountCents = coupon && String(coupon.shopId) === shopId ? toCents(discount) : 0;

        const netCents = subtotalCents - discountCents;
        const feeCents = Math.round(netCents * feeRate);

        return {
            cart,
            shippingAddress: address,
            user: userID,
            totalPrice: (netCents + feeCents) / 100,
            platformFee: feeCents / 100,
            discountPrice: discountCents / 100,
            couponCode: discountCents > 0 ? coupon.name : "",
            status: "Processing",
            paymentInfo,
        };
    });
};

// Loads every product from the database, checks stock, and builds the cart.
// Never trusts prices or seller ids sent by the browser.
const buildCart = async (items) => {
    const normalizedItems = [];

    for (const item of items) {
        const product = await ProductModel.findById(item.product);
        if (!product) {
            throw new Error(`Product not found: ${item.product}`);
        }

        const quantity = getQuantity(item.quantity);

        if (product.stock < quantity) {
            throw new Error(`${product.name} is out of stock (only ${product.stock} left)`);
        }

        normalizedItems.push({
            product: product,
            quantity,
            seller: String(product.shopId)
        });
    }

    return normalizedItems;
};


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address, couponCode } = req.body;
        const userID = req.userID;

        if (!address || !Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        const normalizedItems = await buildCart(items);
        const { discount, coupon } = await getCouponDiscount(couponCode, normalizedItems, getProductUnitPrice);

        // One order per shop, cash on delivery has no card fee
        const docs = buildShopOrderDocs({
            normalizedItems,
            address,
            userID,
            coupon,
            discount,
            paymentInfo: { type: "COD", status: "Pending" },
            feeRate: 0,
        });

        // All the shop orders are saved together or not at all
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                await OrderModel.insertMany(docs, { session });
            });
        } finally {
            session.endSession();
        }

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    let createdOrderIds = [];

    try {
        const { items, address, couponCode } = req.body;
        const userID = req.userID;
        const frontendUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

        if (!address || !Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        const normalizedItems = await buildCart(items);
        const { discount, coupon } = await getCouponDiscount(couponCode, normalizedItems, getProductUnitPrice);

        // One order per shop, with the 2% card fee
        const docs = buildShopOrderDocs({
            normalizedItems,
            address,
            userID,
            coupon,
            discount,
            paymentInfo: { type: "Online", status: "Pending" },
            feeRate: FEE_RATE,
        });

        // Stripe cannot charge less than 50 cents
        const totalCents = docs.reduce((sum, doc) => sum + toCents(doc.totalPrice), 0);
        if (totalCents < 50) {
            throw new Error("Order total is too small to pay online");
        }

        const orders = await OrderModel.insertMany(docs);
        createdOrderIds = orders.map((order) => order._id);

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // One line per shop order: the Stripe total is exactly the sum of the orders
        const line_items = orders.map((order) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: `Order from ${order.cart[0]?.product?.shop?.name || "shop"}`,
                    description: order.cart
                        .map((item) => `${item.product.name} x${item.quantity}`)
                        .join(", ")
                        .slice(0, 500),
                },
                unit_amount: toCents(order.totalPrice),
            },
            quantity: 1,
        }));

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontendUrl}/success`,
            cancel_url: `${frontendUrl}/cart`,
            expires_at: Math.floor(Date.now() / 1000) + 31 * 60,   // Stripe needs at least 30 minutes
            metadata: {
                orderIds: createdOrderIds.join(","),
                userID
            }
        });


        return res.json({ success: true, url: session.url });
    } catch (error) {
        // Something failed after the orders were saved: do not leave unpaid orders behind
        if (createdOrderIds.length > 0) {
            await OrderModel.deleteMany({ _id: { $in: createdOrderIds } }).catch(() => { });
        }
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
        const orderIds = (session.metadata?.orderIds || "").split(",").filter(Boolean);

        try {
            const orders = await OrderModel.find({ _id: { $in: orderIds } });

            // Every order must exist, and the amount Stripe collected must equal their total
            const expectedCents = orders.reduce((sum, order) => sum + toCents(order.totalPrice), 0);

            if (orders.length === 0 || orders.length !== orderIds.length || session.amount_total !== expectedCents) {
                console.error("Webhook mismatch for session", session.id, session.amount_total, expectedCents);
                return res.status(200).json({ received: true });
            }

            // Only orders that are not paid yet (Stripe can send the same event twice)
            await OrderModel.updateMany(
                { _id: { $in: orderIds }, "paymentInfo.status": { $ne: "Paid" } },
                {
                    $set: {
                        paymentInfo: { id: session.payment_intent, type: "Online", status: "Paid" },
                        paidAt: Date.now()
                    }
                }
            );
        } catch (dbError) {
            console.error("Database Update Failed:", dbError.message);
            // 500 tells Stripe to retry later
            return res.status(500).json({ success: false });
        }
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const orderIds = (session.metadata?.orderIds || "").split(",").filter(Boolean);

        try {
            // Delete only orders that were never paid
            await OrderModel.deleteMany({
                _id: { $in: orderIds },
                "paymentInfo.status": "Pending"
            });
        } catch (dbError) {
            console.error("Cleanup of expired orders failed:", dbError.message);
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
            // Hide card orders that were never paid
            $or: [
                { "paymentInfo.type": "COD" },
                { "paymentInfo.status": { $in: ["Paid", "Refunded"] } }
            ]
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
            $or: [{ "paymentInfo.type": "COD" }, { "paymentInfo.status": { $in: ["Paid", "Refunded"] } }]

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
            "cart.seller": req.sellerID,
            $or: [{ "paymentInfo.type": "COD" }, { "paymentInfo.status": { $in: ["Paid", "Refunded"] } }]

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

        // Only a seller who has items in this order can change it
        if (!sellerOwnsOrder(order, req.sellerID)) {
            return res.status(403).json({ success: false, message: "This is not your order" });
        }

        // Only known statuses, and delivery stages cannot go backwards
        const nextStatus = req.body.status;
        if (!VALID_STATUSES.includes(nextStatus)) {
            return res.json({ success: false, message: `Invalid status: ${nextStatus}` });
        }
        const from = DELIVERY_FLOW.indexOf(order.status);
        const to = DELIVERY_FLOW.indexOf(nextStatus);
        if (from !== -1 && to !== -1 && to < from) {
            return res.json({ success: false, message: "An order cannot move back to an earlier status" });
        }

        // Stock is taken exactly once, whichever of the two statuses comes first
        const stockAlreadyDepleted = STOCK_DEPLETED_STATUSES.includes(order.status);
        const isNowDepletingStatus = STOCK_DEPLETED_STATUSES.includes(nextStatus);

        // A transaction makes this all-or-nothing: if ONE item has no stock, NO item is reduced
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                if (isNowDepletingStatus && !stockAlreadyDepleted) {
                    // Only this seller's items (matters for old orders that mix several shops)
                    const myItems = order.cart.filter((item) => item.seller === String(req.sellerID));

                    for (const item of myItems) {
                        await reduceStock(item.product?._id || item.product, item.quantity, session);
                    }
                }


                order.status = nextStatus;

                if (nextStatus === "Delivered") {
                    order.deliveredAt = Date.now();
                    if (order.paymentInfo.type === "COD") {
                        order.paymentInfo.status = "Paid";
                        order.paidAt = Date.now();
                    }
                }

                await order.save({ session, validateBeforeSave: false });
            });
        } finally {
            session.endSession();
        }

        return res.json({ success: true, message: "Order status updated successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


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



// Accept Refund : /api/order/order-refund-success/:id
export const refundAccept = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (!sellerOwnsOrder(order, req.sellerID)) {
            return res.status(403).json({ success: false, message: "This is not your order" });
        }

        if (!VALID_STATUSES.includes(req.body.status)) {
            return res.json({ success: false, message: `Invalid status: ${req.body.status}` });
        }

        // The money and the stock are handled only the FIRST time the refund is accepted
        const firstAccept = req.body.status === REFUND_ACCEPT_STATUS && order.status !== REFUND_ACCEPT_STATUS;
        let note = "";

        if (firstAccept) {
            const payment = order.paymentInfo || {};

            if (payment.type === "Online" && payment.status === "Paid") {
                if (payment.id) {
                    // Money goes back to the buyer's card.
                    // The idempotency key means a retry can never refund twice.
                    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
                    await stripeInstance.refunds.create(
                        { payment_intent: payment.id, amount: toCents(order.totalPrice) },
                        { idempotencyKey: `refund_${order._id}` }
                    );
                    order.paymentInfo.status = "Refunded";
                } else {
                    note = " This order has no saved Stripe payment id, so please refund it in your Stripe dashboard.";
                }
            } else if (payment.type === "COD" && payment.status === "Paid") {
                note = " This was cash on delivery, so please return the cash to the buyer yourself.";
            }

            // Stock goes back, only for this seller's items
            const myItems = order.cart.filter((item) => item.seller === String(req.sellerID));
            for (const item of myItems) {
                await updateRefundStock(item.product?._id || item.product, item.quantity);
            }
        }

        order.status = req.body.status
        await order.save({ validateBeforeSave: false });

        return res.json({ success: true, message: "Order status updated successfully." + note });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}



// Takes stock in ONE atomic step: the database only subtracts if enough is left
const reduceStock = async (productId, qty, session) => {
    const updated = await ProductModel.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty, soldOut: qty } },
        { new: true, session }
    );

    if (!updated) {
        const stillExists = await ProductModel.exists({ _id: productId }).session(session);
        if (stillExists) {
            throw new Error("Not enough stock for one of the items");
        }
        // The seller deleted the product: nothing to reduce, the order can still continue
    }
};

// Gives stock back in one atomic step
async function updateRefundStock(productId, qty) {
    await ProductModel.updateOne(
        { _id: productId },
        { $inc: { stock: qty, soldOut: -qty } }
    );
}