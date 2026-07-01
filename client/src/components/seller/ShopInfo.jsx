import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopInfo = ({ isOwner }) => {
    // Accessing seller data from Redux state
    const { seller } = useSelector((state) => state.seller);

    const navigate = useNavigate();

    // Fallback data mapping to look exactly like image_cc15be_2.png if Redux is loading
    const shopName = seller?.name || "Becodemy";
    const shopAddress = seller?.address || "4678 Honeysuckle Lane, Seattle";
    const shopPhone = seller?.phoneNumber || "1783811512";
    const totalProducts = seller?.totalProducts || 10;
    const shopRatings = seller?.ratings || "4/5";

    // Formatting standard ISO date string to YYYY-MM-DD
    const joinedDate = seller?.createdAt
        ? new Date(seller.createdAt).toISOString().slice(0, 10)
        : "2023-03-17";


    const handleLogout = async () => {
        try {
            const { data } = await axios.post("/api/seller/seller-logout");

            if (data.success) {
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Shop Profile Image */}
            <div className="w-full flex justify-center mb-4">
                <div className="w-37.5 h-37.5 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${seller.avatar}`}
                        alt={shopName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Shop Name */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">
                {shopName}
            </h3>

            {/* Information Blocks */}
            <div className="w-full space-y-6 text-left px-2">

                {/* Address */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Address</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{shopAddress}</p>
                </div>

                {/* Phone Number */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Phone Number</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{shopPhone}</p>
                </div>

                {/* Total Products */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Total Products</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{totalProducts}</p>
                </div>

                {/* Shop Ratings */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Shop Ratings</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{shopRatings}</p>
                </div>

                {/* Joined On */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Joined On</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{joinedDate}</p>
                </div>

            </div>

            {/* Conditional Button Group */}
            {isOwner && (
                <div className="w-full px-2 mt-8">
                    <button className="w-full h-11.25 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer">
                        Edit Shop
                    </button>
                    <button className="w-full h-11.25 mt-5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopInfo;