import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../redux/actions/productAction';
import { loadSeller } from '../../redux/actions/sellerAction';
import { LoadSellerFail } from '../../redux/slices/sellerSlice';
import { updateSeller } from '../../redux/actions/sellerAction';
import StarRating from '../StarRating';

const ShopInfo = ({ isOwner }) => {
    // Accessing seller data from Redux state
    const { seller, sellerLoading } = useSelector((state) => state.seller);
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [password, setPassword] = useState("");
    const [sellerData, setSellerData] = useState({
        name: "",
        email: "",
        phoneNumber: 0,
        address: "",
        zipCode: "",
        description: "",
        avatar: ""
    });

    const [sellerRating, setSellerRating] = useState({
        average: 0,
        total: 0
    });

    // Sync state configuration safely when data becomes available
    useEffect(() => {
        if (seller) {
            setSellerData({
                name: seller.name || "",
                email: seller.email || "",
                phoneNumber: seller.phoneNumber || 0,
                address: seller.address || "",
                zipCode: seller.zipCode || "",
                description: seller.description || "",
                avatar: seller.avatar || ""
            });
        }
    }, [seller]);

    // Calculate ratings from products
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            // Get all reviews from products
            const allReviews = allProducts.flatMap(product => product.reviews || []);

            if (allReviews.length > 0) {
                const totalRating = allReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                const average = totalRating / allReviews.length;

                setSellerRating({
                    average: Number(average.toFixed(1)),
                    total: allReviews.length
                });
            } else {
                setSellerRating({
                    average: 0,
                    total: 0
                });
            }
        }
    }, [allProducts]);

    const handleLogout = async () => {
        try {
            const { data } = await axios.post("/api/seller/seller-logout");

            if (data.success) {
                dispatch(LoadSellerFail(null))
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSave = async () => {
        if (!password) {
            toast.error("Please enter your current password to verify updates.");
            return;
        }

        const formData = new FormData();
        formData.append("name", sellerData.name);
        formData.append("email", sellerData.email);
        formData.append("password", password);
        formData.append("phoneNumber", sellerData.phoneNumber);
        formData.append("address", sellerData.address);
        formData.append("zipCode", sellerData.zipCode);
        formData.append("description", sellerData.description);

        if (image) {
            formData.append("file", image);
        }

        const result = await dispatch(updateSeller(formData));
        if (result && result.success) {
            toast.success("Shop profile successfully updated!");
            setIsEdit(false);
            setPassword("");
            setImage(false);
        } else {
            toast.error(result?.message || "An error occurred while updating shop profile.");
        }
    };

    // Once seller is available, fetch that seller's products
    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProducts(seller._id))
        }
    }, [seller?._id, dispatch])

    if (sellerLoading || !seller?._id) {
        return (
            <div className="w-full flex justify-center py-10">
                <p className="text-sm text-gray-500">Loading shop info...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Shop Profile Image */}
            <div className="w-full flex justify-center mb-4">
                <div className="w-37.5 h-37.5 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm relative group">
                    {isEdit ? (
                        <label htmlFor="shop-avatar" className="cursor-pointer block relative w-full h-full">
                            <img
                                src={image ? URL.createObjectURL(image) : sellerData.avatar}
                                alt={sellerData.name}
                                className="w-full h-full object-cover opacity-80 transition-opacity hover:opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-lg bg-black/20 rounded-full text-white">📷</div>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="shop-avatar"
                                hidden
                                accept="image/*"
                            />
                        </label>
                    ) : (
                        <img
                            src={`${sellerData.avatar}`}
                            alt={sellerData.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Information Blocks */}
            <div className="w-full space-y-6 text-left px-2">

                {/* Shop Name */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Shop Name</h5>
                    {isEdit ? (
                        <input
                            type="text"
                            value={sellerData.name}
                            onChange={(e) => setSellerData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Email</h5>
                    {isEdit ? (
                        <input
                            type="email"
                            value={sellerData.email}
                            onChange={(e) => setSellerData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.email}</p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Address</h5>
                    {isEdit ? (
                        <input
                            type="text"
                            value={sellerData.address}
                            onChange={(e) => setSellerData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.address}</p>
                    )}
                </div>

                {/* Zip Code */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Zip Code</h5>
                    {isEdit ? (
                        <input
                            type="text"
                            value={sellerData.zipCode}
                            onChange={(e) => setSellerData(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.zipCode}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Phone Number</h5>
                    {isEdit ? (
                        <input
                            type="text"
                            value={sellerData.phoneNumber}
                            onChange={(e) => setSellerData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.phoneNumber}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Description</h5>
                    {isEdit ? (
                        <textarea
                            value={sellerData.description}
                            onChange={(e) => setSellerData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-colors mt-0.5 resize-y min-h-15"
                            rows="3"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm mt-0.5">{sellerData.description || "No description added yet"}</p>
                    )}
                </div>

                {/* Total Products */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Total Products</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{allProducts?.length ?? 0}</p>
                </div>

                {/* Shop Ratings */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Shop Ratings</h5>
                    <div className="mt-0.5">
                        {sellerRating.total > 0 ? (
                            <StarRating rating={sellerRating.average} totalReviews={sellerRating.total} size="md" />
                        ) : (
                            <p className="text-gray-400 text-sm">No ratings yet</p>
                        )}
                    </div>
                </div>





                {/* Joined On */}
                <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">Joined On</h5>
                    <p className="text-gray-500 text-sm mt-0.5">{new Date(seller.createdAt).toISOString().slice(0, 10)}</p>
                </div>

                {/* Password field required to authorize updates */}
                {isEdit && (
                    <div className="bg-primary-50/40 p-4 border border-primary-200/60 rounded-xl mt-2">
                        <label className="text-xs font-bold text-primary">Confirm Current Password</label>
                        <p className="text-xs text-primary mb-1">Enter your password below to securely authorize these shop profile updates.</p>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-primary rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-dull transition-colors"
                        />
                    </div>
                )}

            </div>

            {/* Conditional Button Group */}
            {isOwner && (
                <div className="w-full px-2 mt-8">
                    {isEdit ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setIsEdit(false); setPassword(""); setImage(false); }}
                                className="flex-1 h-11.25 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 h-11.25 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer"
                            >
                                Save Profile
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEdit(true)}
                                className="w-full h-11.25 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer"
                            >
                                Edit Shop
                            </button>
                            <button
                                className="w-full h-11.25 mt-5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopInfo;