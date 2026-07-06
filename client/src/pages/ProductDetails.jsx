import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RelatedProducts from "../components/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/productAction";
import toast from "react-hot-toast";
import { addToCart } from "../redux/actions/cartAction";
import { addToWishlist, removeFromWishlist } from "../redux/actions/wishlistAction";

const ProductDetails = () => {
    const { seller } = useSelector((state) => state.seller);
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);
    const { cart } = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);

    const [activeTab, setActiveTab] = useState("reviews");
    const [count, setCount] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Real product data, pulled from the DB-backed Redux store instead of mock assets
    const product = allProducts?.find((item) => item._id === id);

    // Only real DB images — no fake/static fallback image anymore.
    // Empty array if the product has no images at all.
    const imagesGallery = product?.images?.length > 0 ? product.images : [];

    // All hooks must run unconditionally, on every render, in the same order —
    // so this now sits ABOVE the early `return`s below, instead of after them.
    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProducts(seller._id));
        }
    }, [dispatch, seller]);

    // Keep the selected preview image in sync once the product (and its images) load in,
    // since imagesGallery is empty on the very first render before allProducts populates.
    useEffect(() => {
        if (imagesGallery.length > 0) {
            setSelectedImage(imagesGallery[0]);
        }
    }, [product?._id]);

    // The same product's entry in the cart, if it's already been added —
    // used to keep this page's quantity stepper in sync with the actual cart state
    const cartItem = cart && product ? cart.find((i) => i._id === product._id) : undefined;

    // Whenever the cart quantity for this product changes (added/updated from
    // elsewhere, e.g. the cart drawer), reflect that here instead of drifting
    // out of sync with a purely local counter.
    useEffect(() => {
        setCount(cartItem ? cartItem.quantity : 1);
    }, [cartItem?.quantity, product?._id]);

    if (productLoading) {
        return <div className="text-center py-12 text-gray-400">Loading product...</div>;
    }

    if (productError) {
        return <div className="text-center py-12 text-secondary">{productError}</div>;
    }

    if (!product) {
        return <div className="text-center py-12">Product not found</div>;
    }

    // The product's embedded shop info, straight from the DB (ProductSchema.shop),
    // instead of a separately imported mock seller object
    const shop = product.shop;

    // Products belonging to the same shop, derived from the already-fetched list —
    // real DB-derived count instead of a hardcoded/mock "totalProducts" value
    const shopProductCount = allProducts.filter((p) => p.shopId === product.shopId).length;

    // Whether this exact product is currently in the wishlist, so the heart
    // button can render filled/active and toggle correctly
    const isWishlisted = !!(wishlist && wishlist.find((i) => i._id === product._id));

    const handleWishlist = () => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(product._id));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addToWishlist(product));
            toast.success("Added to wishlist");
        }
    };

    const handleCart = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id)

        if (isItemExists) {
            toast.error("Item already exists!")
        } else {
            if (product.stock < count) {
                toast.error("Product stock limited")
            }
            else {
                const cartData = { ...product, quantity: count }
                dispatch(addToCart(cartData))
                toast.success("Item added to cart successfully")
            }
        }
    }

    // Single handler for both + and - buttons. If the product is already in
    // the cart, this updates the cart's quantity directly (via the addToCart
    // thunk, so localStorage stays in sync) instead of only changing local
    // state — that mismatch was why the stepper looked "stuck" and never
    // reflected what was actually in the cart.
    const handleQuantityChange = (amount) => {
        const newQty = count + amount;

        if (newQty <= 0) return;

        if (newQty > product.stock) {
            toast.error("Product stock limited");
            return;
        }

        if (cartItem) {
            dispatch(addToCart({ ...product, quantity: newQty }));
        }

        setCount(newQty);
    };

    return (
        <section className="mt-12 max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500">
                <Link to={"/"} className="hover:text-primary">Home</Link> /
                <Link to={"/products"} className="hover:text-primary"> Products</Link> /
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary"> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            {/* Main Product Section */}
            <div className="flex flex-col md:flex-row gap-12 mt-4">

                {/* Product Images Layout */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-1/2">
                    {imagesGallery.length > 0 ? (
                        <>
                            {/* Thumbnails Sidebar — only rendered when real images exist */}
                            <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible">
                                {imagesGallery.map((image, index) => {
                                    const imgUrl = typeof image === "string" ? image : image.url;
                                    const isSelected = selectedImage === imgUrl;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(imgUrl)}
                                            className={`border w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden cursor-pointer transition shrink-0 ${isSelected ? "border-primary ring-1 ring-primary" : "border-gray-300/60 hover:border-primary"
                                                }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover select-none"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Main Featured Image Preview Box */}
                            <div className="border border-gray-200 w-full aspect-square max-w-120 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                <img
                                    src={selectedImage}
                                    alt="Selected product preview"
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            </div>
                        </>
                    ) : (
                        // No images on this product at all — show a plain empty state
                        // instead of a fake stock photo.
                        <div className="border border-gray-200 w-full aspect-square max-w-120 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Rating — not part of ProductSchema, so this stays a dummy inline value */}
                    <div className="flex items-center gap-0.5 mt-1">
                        <div
                            className="star-rating"
                            data-rating={4.5}
                            style={{ "--rating-percent": `${(4.5 / 5) * 100}%` }}
                            aria-label="Rated 4.5 out of 5 stars"
                        ></div>
                        <p className="text-base ml-1 text-gray-500">
                            {(4.5).toFixed(1)} ({(128).toLocaleString()} sold)
                        </p>
                    </div>

                    {/* Seller Info Card — sourced from product.shop (DB), not a mock seller import */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mt-4">
                        <div className="flex items-center gap-3">
                            <Link to={`/shop/${shop._id}`}>
                                <img
                                    src={`${shop?.avatar}`}
                                    alt={shop?.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </Link>
                            <div>
                                <p className="font-medium text-gray-800 hover:text-primary cursor-pointer">{shop?.name}</p>
                                <div className="flex items-center gap-1">
                                    <div
                                        className="star-rating"
                                        data-rating={4.5}
                                        style={{ "--rating-percent": `${(4.5 / 5) * 100}%` }}
                                        aria-label="Rated 4.5 out of 5 stars"
                                    ></div>
                                    <span className="text-xs text-gray-500">(4.5)</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/inbox?conversation=57ui4fg43xv")}
                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition"
                        >
                            Send Message
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ${product.originalPrice}</p>
                        <p className="text-2xl font-medium text-primary">${product.discountPrice}</p>
                        <span className="text-gray-500/70 text-xs">(inclusive of all taxes)</span>
                    </div>

                    {/* Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70 space-y-1">
                        {product.description.map((desc, index) => (
                            <li key={index} className="marker:text-primary">{desc}</li>
                        ))}
                    </ul>

                    {/* Quantity Selector and Buttons */}
                    <div className="mt-6 relative">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                        <div className="flex items-center gap-3 mb-4">
                            <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                -
                            </button>
                            <span className="w-8 text-center font-medium">{count}</span>
                            <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                +
                            </button>
                        </div>
                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlist}
                            title={isWishlisted ? "Remove from Wishlist" : "Add To Wishlist"}
                            className={`absolute top-7 right-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-full shadow-md border group ${isWishlisted ? "border-red-300" : "border-zinc-200"
                                }`}
                        >
                            <svg width="12" height="14" viewBox="0 0 9 11" fill={isWishlisted ? "#ef4444" : "none"} xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z" stroke={isWishlisted ? "#ef4444" : "#27272a"} className="group-hover:stroke-red-500 transition-colors" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center mt-2 gap-4 text-base">
                        <button
                            onClick={() => handleCart(product._id)}
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg">
                            Add to Cart
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition rounded-lg">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation and Content Section */}
            <div className="mt-16">
                {/* Tab Headers */}
                <div className="flex gap-8 justify-between border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`pb-3 text-lg font-medium transition relative ${activeTab === "reviews" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Product Reviews
                        {activeTab === "reviews" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("seller")}
                        className={`pb-3 text-lg font-medium transition relative ${activeTab === "seller" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Seller Information
                        {activeTab === "seller" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                        )}
                    </button>
                </div>

                {/* Single Content Div - Changes based on active tab */}
                <div className="mt-6">
                    {/* Product Reviews Content — no Review model exists yet, so this list is
                        inline dummy data directly in JSX rather than pulled from Redux/DB */}
                    {activeTab === "reviews" && (
                        <div id="reviews">
                            {[
                                {
                                    id: 1,
                                    userName: "Alex Johnson",
                                    stars: 5,
                                    comment: "Great quality, exactly as described. Would buy again!",
                                    createdAt: "2026-05-12"
                                },
                                {
                                    id: 2,
                                    userName: "Priya Sharma",
                                    stars: 4,
                                    comment: "Good product overall, shipping took a bit longer than expected.",
                                    createdAt: "2026-04-28"
                                }
                            ].length === 0 ? (
                                <p className="text-gray-400 text-sm py-6 text-center">
                                    No reviews yet. Be the first to review this product!
                                </p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {[
                                        {
                                            id: 1,
                                            userName: "Alex Johnson",
                                            stars: 5,
                                            comment: "Great quality, exactly as described. Would buy again!",
                                            createdAt: "2026-05-12"
                                        },
                                        {
                                            id: 2,
                                            userName: "Priya Sharma",
                                            stars: 4,
                                            comment: "Good product overall, shipping took a bit longer than expected.",
                                            createdAt: "2026-04-28"
                                        }
                                    ].map((review) => (
                                        <div key={review.id} className="border border-gray-200 rounded-xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-800">{review.userName}</p>
                                                    <div className="flex items-center gap-0.5 mt-1">
                                                        <div
                                                            className="star-rating"
                                                            data-rating={review.stars}
                                                            style={{ "--rating-percent": `${(review.stars / 5) * 100}%` }}
                                                            aria-label={`Rated ${review.stars} out of 5 stars`}
                                                        ></div>
                                                        <p className="text-base ml-1 text-gray-500">
                                                            {review.stars.toFixed(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Seller Information Content — real fields (name, avatar, joined date,
                        product count) come from product.shop / allProducts; rating and review
                        count stay inline dummy values since there's no rating/review model yet */}
                    {activeTab === "seller" && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md">
                            <div className="text-center pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800">{shop?.name}</h3>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <div className="flex items-center gap-0.5 mt-1">
                                        <div
                                            className="star-rating"
                                            data-rating={4.5}
                                            style={{ "--rating-percent": `${(4.5 / 5) * 100}%` }}
                                            aria-label="Rated 4.5 out of 5 stars"
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-1">(4.5) Ratings</span>
                                </div>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae repellat pariatur inventore reprehenderit minus obcaecati ut ipsa, illo quas magnam excepturi beatae. Deleniti ipsa reiciendis quidem dolores natus, odio perspiciatis.
                                </p>
                            </div>

                            <div className="py-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Joined On:</span>
                                    <span className="text-gray-800 font-medium">
                                        {shop?.createdAt ? new Date(shop.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        }) : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Products:</span>
                                    <span className="text-gray-800 font-medium">{shopProductCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Reviews:</span>
                                    <span className="text-gray-800 font-medium">{(128).toLocaleString()}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition"
                                onClick={() => navigate(`/shop/${shop._id}`)}
                            >
                                Visit Shop
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products Section */}
            <RelatedProducts />
        </section>
    );
};

export default ProductDetails;