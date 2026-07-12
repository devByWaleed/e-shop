import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserOrder } from '../redux/actions/orderAction';

const UserOrderTrack = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user } = useSelector((state) => state.user);
    
    // 1. Destructure loading state from your order reducer (assuming your slice has it)
    const { orders, loading } = useSelector((state) => state.order);

    useEffect(() => {
        if (user?._id) {
            dispatch(getUserOrder(user._id));
        }
    }, [dispatch, user?._id]);

    // 2. Find the target order inside the array
    const data = orders && orders.find((item) => item._id === id);

    // 3. Render a loading spinner/message if the API call is still processing
    if (loading) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <h1 className="text-[20px] text-gray-500">Loading tracking details...</h1>
            </div>
        );
    }

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            {
                data && data?.status === "Processing" ? (
                    <h1 className="text-[20px]">Your Order is processing in shop.</h1>
                ) : data?.status === "Transferred to delivery partner" ? (
                    <h1 className="text-[20px]">Your Order is on the way for delivery partner.</h1>
                ) : data?.status === "Shipping" ? (
                    <h1 className="text-[20px]">Your Order is on the way with our delivery partner.</h1>
                ) : data?.status === "Received" ? (
                    <h1 className="text-[20px]">Your Order is in your city. Our Delivery man will deliver it.</h1>
                ) : data?.status === "On the way" ? (
                    <h1 className="text-[20px]">Our Delivery man going to deliver your order.</h1>
                ) : data?.status === "Delivered" ? (
                    <h1 className="text-[20px]">Your order is delivered!</h1>
                ) : 
                
                data?.status === "Processing refund" ? (
                    <h1 className="text-[20px]">Your refund is under processing</h1>
                ) : 
                
                data?.status === "Refund success" ? (
                    <h1 className="text-[20px]">Your refund is success</h1>
                ) : 
                                
                (
                    <h1 className="text-[20px] text-red-500">No order tracking details available.</h1>
                )
            }
        </div>
    );
};

export default UserOrderTrack;