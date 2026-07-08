import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/actions/cartAction';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.removeItem("latestOrder");
        localStorage.removeItem("cartItems");
        localStorage.setItem("latestOrder", JSON.stringify([]));
        localStorage.setItem("cartItems", JSON.stringify([]));
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans px-4">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center flex flex-col items-center gap-6">

                {/* Purple Success Banner Circle Element */}
                <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
                    Your order is successful 😍
                </h1>

                <p className="text-sm text-gray-500 leading-relaxed">
                    Thank you for your purchase! Your order parameters have been transmitted safely to our vendor systems.
                </p>

                <button onClick={() => navigate("/")} className="w-full mt-2 bg-[#ff3b57] hover:bg-[#e02e48] text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                    Go back to Homepage
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;