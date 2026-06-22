import { Link, useNavigate, useParams } from "react-router-dom";
import { assets, productData, reviews, seller } from "../assets/assets";
import { useState } from "react";
import RelatedProducts from "../components/RelatedProducts";

const ProductDetails = () => {
    const [activeTab, setActiveTab] = useState("reviews")
    const [count, setCount] = useState(0)
    const { id } = useParams()
    const productId = Number(id)

    const product = productData.find((item) => item.id === productId)

    const navigate = useNavigate()

    // Fallback images array for testing if your static mock data only has 1 image
    const imagesGallery = product?.image_Url && product.image_Url.length > 1
        ? product.image_Url
        : [
            product?.image_Url?.[0].url || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80" // 2nd Image from Unsplash/Google for testing
        ];

    // State to hold the currently selected preview image URL
    const [selectedImage, setSelectedImage] = useState(imagesGallery[0]);

    const incrementCount = () => {
        setCount((prev) => prev + 1)
    }

    const decrementCount = () => {
        if (count > 0) {
            setCount((prev) => prev - 1)
        }
    }

    if (!product) {
        return <div className="text-center py-12">Product not found</div>;
    }

    return (
        <section className="mt-12 max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500">
                <Link to={"/"} className="hover:text-primary">Home</Link> /
                <Link to={"/products"} className="hover:text-primary"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary"> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            {/* Main Product Section */}
            <div className="flex flex-col md:flex-row gap-12 mt-4">

                {/* Product Images Layout */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-1/2">
                    {/* Thumbnails Sidebar */}
                    <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible">
                        {imagesGallery.map((image, index) => {
                            // Determine if string URL or structured nested object asset
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
                </div>

                {/* Product Info */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                        <div
                            className="star-rating"
                            data-rating={product.rating}
                            style={{ "--rating-percent": `${(product.rating / 5) * 100}%` }}
                            aria-label={`Rated ${product.rating} out of 5 stars`}
                        ></div>
                        <p className="text-base ml-1 text-gray-500">
                            {product.rating.toFixed(1)} ({product.total_sell} sold)
                        </p>
                    </div>

                    {/* Seller Info Card */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mt-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={seller.avatar}
                                alt={seller.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium text-gray-800">{seller.name}</p>
                                <div className="flex items-center gap-1">
                                    <div
                                        className="star-rating"
                                        data-rating={seller.rating}
                                        style={{ "--rating-percent": `${(seller.rating / 5) * 100}%` }}
                                        aria-label={`Rated ${seller.rating} out of 5 stars`}
                                    ></div>
                                    <span className="text-xs text-gray-500">({seller.rating})</span>
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
                        <p className="text-gray-500/70 line-through">MRP: ${product.price}</p>
                        <p className="text-2xl font-medium text-primary">${product.discount_price}</p>
                        <span className="text-gray-500/70 text-xs">(inclusive of all taxes)</span>
                    </div>

                    {/* Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70 space-y-1">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {/* Quantity Selector and Buttons */}
                    <div className="mt-6 relative">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                        <div className="flex items-center gap-3 mb-4">
                            <button onClick={decrementCount} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                -
                            </button>
                            <span className="w-8 text-center font-medium">{count}</span>
                            <button onClick={incrementCount} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                +
                            </button>
                        </div>
                        {/* Wishlist Button */}
                        <button title="Add To Wishlist" className="absolute top-7 right-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-full shadow-md border border-zinc-200 group">
                            <svg width="12" height="14" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z" stroke="#27272a" className="group-hover:stroke-red-500 transition-colors" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center mt-2 gap-4 text-base">
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg">
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
                    {/* Product Reviews Content */}
                    {activeTab === "reviews" && (
                        <div id="reviews">
                            {reviews.length === 0 ? (
                                <p className="text-gray-400 text-sm py-6 text-center">
                                    No reviews yet. Be the first to review this product!
                                </p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {reviews.map((review) => (
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

                    {/* Seller Information Content */}
                    {activeTab === "seller" && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md">
                            <div className="text-center pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800">{seller.name}</h3>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <div className="flex items-center gap-0.5 mt-1">
                                        <div
                                            className="star-rating"
                                            data-rating={seller.rating}
                                            style={{ "--rating-percent": `${(seller.rating / 5) * 100}%` }}
                                            aria-label={`Rated ${seller.rating} out of 5 stars`}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-1">({seller.rating}) Ratings</span>
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
                                    <span className="text-gray-800 font-medium">{seller.joinedDate}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Products:</span>
                                    <span className="text-gray-800 font-medium">{seller.totalProducts.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Reviews:</span>
                                    <span className="text-gray-800 font-medium">{seller.totalReviews.toLocaleString()}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition">
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