import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlistAction";
import { addToCart } from "../redux/actions/cartAction";
import toast from "react-hot-toast";

const ProductCard = ({ product, index }) => {
    const { seller } = useSelector((state) => state.seller);
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);

    const [click, setClick] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const c = product.category;
    let categorySlug = c.toLowerCase().replace(/\s+/g, "-");

    // Dynamic Wishlist Toggle Logic
    const toggleWishlistHandler = () => {
        if (click) {
            dispatch(removeFromWishlist(product._id));
            toast.success("Removed from wishlist!");
        } else {
            dispatch(addToWishlist(product)); // Passes the full product object
            toast.success("Added to wishlist!");
        }
    };

    // Global Add to Cart Logic
    const handleAddToCart = () => {
        const isItemExist = cart && cart.find((i) => i._id === product._id);
        if (isItemExist) {
            toast.error("Item already in cart!");
        } else {
            if (product.stock < 1) {
                toast.error("Product stock limited!");
            } else {
                const cartData = { ...product, quantity: 1 };
                dispatch(addToCart(cartData));
                toast.success("Added to cart successfully!");
            }
        }
    };

    // Keep UI state synchronized whenever the global wishlist array changes
    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === product._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist, product._id]);

    return (
        <section
            onClick={() => { navigate(`/products/${categorySlug}/${product._id}`); window.scrollTo(0, 0); }}
            key={index}
            className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-4 flex flex-col w-72 md:w-50 relative cursor-pointer"
        >
            {/* Action Buttons Layer */}
            <div
                className="absolute top-2 right-2 flex flex-col gap-2 z-10"
                onClick={(e) => e.stopPropagation()} // Prevents navigation trigger on click
            >
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-dark hover:text-white transition-all duration-200 rounded-full shadow-md border border-zinc-200 group cursor-pointer"
                    title="Add to Cart"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2H4L5 12H19L21 4H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlistHandler}
                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-full shadow-md border border-zinc-200 group cursor-pointer"
                    title={click ? "Remove From Wishlist" : "Add To Wishlist"}
                >
                    <svg className={`transition-colors duration-200 ${click ? "fill-red-500" : "fill-none"}`}
                        width="12" height="14" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z" stroke="#27272a" className="group-hover:stroke-red-500 transition-colors" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Product Image */}
            <div className="flex items-center justify-center h-32 mb-2 pt-4">
                <img
                    src={(product.images && product.images[0]) || "https://assets.prebuiltui.com/images/components/card/card-speaker-image.png"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            <h5 className="pt-3 text-[15px] text-blue-400 pb-3">{seller?.name || "Verified Seller"}</h5>

            {/* Product Name */}
            <p className="text-sm text-neutral-500 mb-2 px-2 line-clamp-2 min-h-10">{product.name}</p>

            {/* Price Footer */}
            <div className="flex items-center gap-2 px-2 mt-auto">
                <span className="text-sm font-semibold text-neutral-800">${product.discountPrice}</span>
                <span className="text-xs font-bold text-secondary line-through">${product.originalPrice}</span>
                <span className="text-sm p-1 rounded text-accent">{product.soldOut || 0} sold</span>
            </div>
        </section>
    );
};

export default ProductCard;