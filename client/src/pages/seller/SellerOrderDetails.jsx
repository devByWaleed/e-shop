import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopOrder } from '../../redux/actions/orderAction';
import toast from 'react-hot-toast';
import axios from 'axios';

const SellerOrderDetails = () => {
  const { seller } = useSelector((state) => state.seller);
  const { shopOrders, orderLoading, orderError } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getShopOrder(seller._id));
    }
  }, [dispatch, seller?._id]);

  const orderData = shopOrders?.find((item) => item._id === id);
  console.log(orderData);


  // Sync state when order finishes loading
  useEffect(() => {
    if (orderData) {
      setStatus(orderData.status);
    }
  }, [orderData]);

  const handleStatusUpdate = async (e) => {
    // const newStatus = e.target.value;
    // setStatus(newStatus);
    // setUpdating(true);

    // try {
    //   const { data } = await axios.put(
    //     `/api/order/update-order-status/${id}`,
    //     { status: newStatus },
    //     { withCredentials: true }
    //   );

    //   if (data.success) {
    //     toast.success("Order status updated successfully!");
    //     dispatch(getShopOrder(seller._id)); // Refresh data
    //   } else {
    //     toast.error(data.message || "Failed to update status");
    //   }
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Something went wrong");
    // } finally {
    //   setUpdating(false);
    // }
  };

  if (orderLoading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading order details...</div>;
  }

  if (orderError) {
    return <div className="text-center py-20 text-red-500 text-lg">{orderError}</div>;
  }

  if (!orderData) {
    return <div className="text-center py-20 text-gray-500 text-lg">Order not found.</div>;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 font-sans">
      {/* Back to Profile Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/seller-profile')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          ← Back to Profile
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            ID: <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-xs">{orderData._id}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Placed on: {new Date(orderData.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Dynamic Status Update Select Selector */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="text-sm font-semibold text-gray-600 shrink-0">Update Status:</label>
          <div className="relative w-full sm:w-48">
            <select
              value={status}
              disabled={updating}
              onChange={handleStatusUpdate}
              className="w-full bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-700 font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
            >
              <option value="Processing">Processing</option>
              <option value="Transferred to delivery partner">Transferred to delivery partner</option>
              <option value="Shipping">Shipping</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart Items list details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
            <h2 className="text-md font-bold text-gray-800 border-b pb-3 mb-4">Ordered Items</h2>
            <div className="divide-y divide-gray-100">
              {orderData.cart?.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.name || "Product"}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{item.product?.name || "Product Title"}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 font-medium">${item.product?.discountPrice || item.product?.originalPrice || 0} each</span>
                      <span className="font-bold text-gray-900">${(item.product?.discountPrice || item.product?.originalPrice || 0) * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Shipping & Financials breakdown panels */}
        <div className="space-y-6">
          {/* Shipping panel */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
            <h2 className="text-md font-bold text-gray-800 border-b pb-3 mb-4">Shipping Information</h2>
            <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
              <p className="font-semibold text-gray-800">{orderData.shippingAddress?.fullName}</p>
              <p>{orderData.shippingAddress?.address1}</p>
              {orderData.shippingAddress?.address2 && <p>{orderData.shippingAddress.address2}</p>}
              <p>{orderData.shippingAddress?.city}, {orderData.shippingAddress?.zipCode}</p>
              <p>{orderData.shippingAddress?.countryName || orderData.shippingAddress?.countryCode}</p>
              <div className="pt-2 border-t mt-2 text-xs text-gray-500 space-y-1">
                <p>📞 Phone: {orderData.shippingAddress?.phone}</p>
                <p>✉️ Email: {orderData.shippingAddress?.email}</p>
              </div>
            </div>
          </div>

          {/* Payment panel */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
            <h2 className="text-md font-bold text-gray-800 border-b pb-3 mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium text-gray-800">{orderData.paymentInfo?.type || "COD"}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${orderData.paymentInfo?.status === "Paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                  {orderData.paymentInfo?.status || "Pending"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold text-base text-gray-800">
                <span>Total Revenue:</span>
                <span className="text-primary">${orderData.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerOrderDetails;