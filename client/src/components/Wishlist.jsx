import { useState } from "react";
import toast from "react-hot-toast";

// Static mock data based on your UI images
const STATIC_WISHLIST_DATA = [
    {
        _id: "6a36b489b2b302fa34e97d9e",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        price: 999,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60"
    },
    {
        _id: "6a36b489b2b302fa34e97d9f",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        price: 245,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60"
    },
    {
        _id: "6a36b489b2b302fa34e97da0",
        name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
        price: 645,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60"
    }
];

const Wishlist = ({ openWishlist, setOpenWishlist }) => {
    const [wishlistItems, setWishlistItems] = useState(STATIC_WISHLIST_DATA);
    const currency = "US$";

    const handleRemoveItem = (id) => {
        setWishlistItems(prev => prev.filter(item => item._id !== id));
        toast.success("Removed from wishlist");
    };

    const handleAddToCart = () => {
        toast.success("Added to cart!");
    };

    return (
        <>
            {/* Dark Background Overlay (Backdrop Shadow) */}
            <div
                onClick={() => setOpenWishlist(false)}
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${openWishlist ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Sidebar Slide-over Panel */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${openWishlist ? "translate-x-0" : "translate-x-full"
                }`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                        {/* Heart Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 fill-red-500/10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span className="text-lg">{wishlistItems.length} items</span>
                    </div>

                    {/* Fixed Close Button */}
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
                    {wishlistItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-base">Your wishlist is empty</p>
                        </div>
                    ) : (
                        wishlistItems.map((item) => (
                            <div key={item._id} className="flex items-center p-4 gap-4 relative group hover:bg-gray-50/50 transition">

                                {/* Remove Cross Button (Left side aligned) */}
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
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-normal text-gray-800 line-clamp-2 leading-snug hover:text-primary cursor-pointer">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-semibold text-red-600 mt-1">
                                        {currency}{item.price}
                                    </p>
                                </div>

                                {/* Add to Cart Icon Action (Right side aligned) */}
                                <button
                                    onClick={() => handleAddToCart(item.name)}
                                    className="p-2 border border-gray-200 hover:border-gray-400 rounded text-gray-700 hover:bg-white hover:shadow-sm transition cursor-pointer shrink-0"
                                    title="Add to Cart"
                                >
                                    {/* Simple Cart Plus SVG Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9h4.5m-4.5 0a4.5 4.5 0 0 1 4.5 4.5M12 9V4.5m0 4.5a4.5 4.5 0 0 0 4.5 4.5M12 9H7.5m4.5 0a4.5 4.5 0 0 0-4.5 4.5M12 9V13.5m0-4.5a4.5 4.5 0 0 1-4.5 4.5" />
                                    </svg>
                                </button>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Wishlist;