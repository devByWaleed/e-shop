import CouponModel from "../models/Coupons.js";

// Returns { discount, coupon }. Throws an Error with a friendly message if the coupon cannot be used.
// normalizedItems: [{ product, quantity, seller }]   unitPriceOf: function(product) -> price
export const getCouponDiscount = async (couponCode, normalizedItems, unitPriceOf) => {
    // No coupon entered: no discount
    if (!couponCode || !String(couponCode).trim()) {
        return { discount: 0, coupon: null };
    }

    // Two shops may use the same name, so pick the coupon of a shop that is in this cart
    const candidates = await CouponModel.find({ name: String(couponCode).trim() });
    const sellersInCart = new Set(normalizedItems.map((item) => item.seller));
    const coupon = candidates.find((c) => sellersInCart.has(String(c.shopId)));

    if (!coupon) {
        throw new Error("Invalid coupon code");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new Error("This coupon has expired");
    }

    // Only items from the coupon's shop (and the selected product, if one is set) get the discount
    const eligibleItems = normalizedItems.filter((item) =>
        item.seller === String(coupon.shopId) &&
        (!coupon.selectedProduct || String(item.product._id) === String(coupon.selectedProduct))
    );

    if (eligibleItems.length === 0) {
        throw new Error("This coupon does not apply to the items in your cart");
    }

    const eligibleTotal = eligibleItems.reduce(
        (sum, item) => sum + unitPriceOf(item.product) * item.quantity,
        0
    );

    if (coupon.minAmount != null && eligibleTotal < coupon.minAmount) {
        throw new Error(`This coupon needs at least ${coupon.minAmount} in eligible items`);
    }
    if (coupon.maxAmount != null && eligibleTotal > coupon.maxAmount) {
        throw new Error(`This coupon works only up to ${coupon.maxAmount} in eligible items`);
    }

    // Percentage of the eligible total, rounded to whole cents
    const discount = Math.round(eligibleTotal * coupon.discountPercentage) / 100;

    return { discount, coupon };
};