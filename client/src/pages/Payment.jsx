import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payment = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [loading, setLoading] = useState(false);
    const currency = "US$";

    useEffect(() => {
        const cachedOrder = localStorage.getItem('latestOrder');
        if (!cachedOrder) {
            toast.error("No order data found. Returning to checkout.");
            navigate("/checkout");
        } else {
            setOrderData(JSON.parse(cachedOrder));
        }
    }, [navigate]);

    if (!orderData) return <div className="text-center py-20">Loading Order Details...</div>;

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Format payloads properly to map with backend schemas
        const payload = {
            items: orderData.cart.map(item => ({
                product: item._id || item.product,
                quantity: item.quantity
            })),
            address: orderData.shippingAddress
        };

        // Configuration to fix your authentication/authorization issue
        const axiosConfig = {
            withCredentials: true // MANDATORY: This passes your login session cookies/tokens to the backend
        };

        try {
            if (paymentMethod === 'Stripe') {
                // Online Stripe processing
                const { data } = await axios.post('/api/order/stripe', payload, axiosConfig);

                if (data.success && data.url) {
                    // Redirect directly to Stripe's secure off-site form
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message || "Stripe Initialization Error.");
                }
            } else if (paymentMethod === 'COD') {
                // Cash On Delivery Processing
                const { data } = await axios.post('/api/order/cod', payload, axiosConfig);

                if (data.success) {
                    toast.success(data.message || "Order placed successfully!");
                    navigate("/success");
                } else {
                    toast.error(data.message || "Failed to place COD order.");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Authorization Error. Please try logging out and back in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Progress Step Bar */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 text-xs sm:text-sm font-medium">
                    <div className="bg-pink-100 text-[#ff3b57] px-4 py-1.5 rounded-full shadow-sm">1. Shipping</div>
                    <div className="h-px w-8 sm:w-16 bg-[#ff3b57]"></div>
                    <div className="bg-[#ff3b57] text-white px-4 py-1.5 rounded-full">2. Payment</div>
                    <div className="h-px w-8 sm:w-16 bg-pink-200"></div>
                    <div className="bg-pink-50 text-[#ff3b57] px-4 py-1.5 rounded-full opacity-70">3. Success</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Payment Selector Column */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Payment Method</h2>
                        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6">

                            {/* Stripe Method selection block */}
                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={() => setPaymentMethod('Stripe')} className="accent-[#ff3b57]" />
                                    <span className="text-sm font-semibold text-gray-700">Pay with Debit / Credit Card (Stripe)</span>
                                </div>
                            </label>

                            {/* Enabled Cash on Delivery option */}
                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-[#ff3b57]" />
                                    <span className="text-sm font-semibold text-gray-700">Cash on Delivery (COD)</span>
                                </div>
                            </label>

                            <button type="submit" disabled={loading} className="w-full mt-4 bg-[#ff3b57] hover:bg-[#e02e48] disabled:bg-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                                {loading ? "Processing transaction..." : "Submit Payment"}
                            </button>
                        </form>
                    </div>

                    {/* Right Summary Column */}
                    <div className="bg-white h-fit rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-2">Order Pricing Summary</h3>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-bold text-gray-900">{currency}{orderData.subtotalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Shipping:</span>
                            <span className="font-medium text-gray-900">
                                {orderData.shippingPrice === 0 ? "Free" : `${currency}${orderData.shippingPrice?.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 pb-4 border-b border-gray-100">
                            <span>Discount:</span>
                            <span className="font-medium text-green-600">
                                {orderData.discountPrice > 0 ? `-${currency}${orderData.discountPrice?.toFixed(2)}` : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-base text-gray-800 font-bold">
                            <span>Total Amount:</span>
                            <span className="text-lg text-gray-900">{currency}{orderData.totalPrice?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;