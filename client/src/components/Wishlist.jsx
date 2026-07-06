import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/actions/wishlistAction"
import { AddToCart } from "../redux/slices/cartSlice"
import { useNavigate } from "react-router-dom";


const Wishlist = ({ openWishlist, setOpenWishlist }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { wishlist } = useSelector((state) => state.wishlist);
    const currency = "US$";

    const handleRemoveItem = (id) => {
        dispatch(removeFromWishlist(id));
        toast.success("Removed from wishlist");
    };

    const handleAddToCart = (item) => {
        // Construct standard payload structure matching your Add To Cart state parameters
        const cartData = { ...item, quantity: 1 };
        dispatch(AddToCart(cartData));
        toast.success("Added to cart!");
    };

    return (
        <>
            {/* Dark Background Overlay (Backdrop Shadow) */}
            <div
                onClick={() => setOpenWishlist(false)}
                className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-9999 transition-opacity duration-300 ${openWishlist ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Sidebar Slide-over Panel */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-10000 flex flex-col transition-transform duration-300 ease-in-out ${openWishlist ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 fill-red-500/10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span className="text-lg font-bold">{(wishlist && wishlist.length) || 0} items</span>
                    </div>

                    <button
                        onClick={() => setOpenWishlist(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Wishlist Items List */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {!wishlist || wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-base">Your wishlist is empty</p>
                        </div>
                    ) : (
                        wishlist.map((item) => {
                            const c = item.category;
                            let categorySlug = c.toLowerCase()
                            categorySlug = categorySlug.replace(/\s+/g, "-")
                            return (
                                <div key={item._id} className="flex items-center p-4 gap-4 relative group hover:bg-gray-50/50 transition">
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="text-gray-400 hover:text-red-500 cursor-pointer transition text-xs p-1"
                                        title="Remove item"
                                    >
                                        &#10005;
                                    </button>

                                    {/* Product Thumbnail */}
                                    <div className="w-20 h-20 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                        <img
                                            src={(item.images && item.images[0]) || item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            onClick={() => { setOpenWishlist(false); navigate(`/products/${categorySlug}/${item._id}`) }}
                                            className="text-sm font-normal text-gray-800 line-clamp-2 leading-snug hover:text-primary cursor-pointer">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm font-semibold text-red-600 mt-1">
                                            {currency}{item.discountPrice || item.price}
                                        </p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    {/* <button
                                        onClick={() => handleAddToCart(item)}
                                        className="p-2 border border-gray-200 hover:border-gray-400 rounded text-gray-700 hover:bg-white hover:shadow-sm transition cursor-pointer shrink-0"
                                        title="Add to Cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </button> */}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default Wishlist;