import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../redux/actions/productAction';
import { loadSeller } from '../../redux/actions/sellerAction';

const ShopInfo = ({ isOwner }) => {
    // Accessing seller data from Redux state
    const { seller } = useSelector((state) => state.seller);
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    const navigate = useNavigate();
    const dispatch = useDispatch();


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

    useEffect(() => {
        dispatch(loadSeller())
    }, [dispatch])

    // Once seller is available, fetch that seller's products
    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProducts(seller._id))
        }
    }, [seller?._id, dispatch])

    return (
        <div className="w-full flex flex-col items-center">
            {/* Shop Profile Image */}
            <div className="w-full flex justify-center mb-4">
                <div className="w-37.5 h-37.5 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${seller.avatar}`}
                        alt={seller.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Shop Name */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">
                {seller.name}
            </h3>

            {/* Information Blocks */}
            <div className="w-full space-y-6 text-left px-2">

                {/* Address */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Address</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{seller.address}</p>
                </div>

                {/* Phone Number */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Phone Number</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{seller.phoneNumber}</p>
                </div>

                {/* Total Products */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Total Products</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{allProducts?.length ?? 0}</p>
                </div>

                {/* Shop Ratings */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Shop Ratings</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{4.5}</p>
                </div>

                {/* Joined On */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Joined On</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{new Date(seller.createdAt).toISOString().slice(0, 10)}</p>
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