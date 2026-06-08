import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import RelatedProducts from "../components/RelatedProducts";

const ProductDetails = () => {
    const [activeTab, setActiveTab] = useState("reviews")

    // Hardcoded product data for visualization
    const product = {
        _id: "1",
        name: "MacBook Pro M2",
        category: "Electronics",
        price: 12999,
        offerPrice: 10995,
        averageRating: 4.2,
        reviewCount: 128,
        inStock: true,
        seller: "Apple Inc.",
        image: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
        ],
        description: [
            "Apple M2 chip with 8-core CPU and 10-core GPU",
            "256GB SSD storage",
            "8GB unified memory",
            "13.6-inch Liquid Retina display",
            "Up to 18 hours of battery life",
            "Space Gray color",
            "Apple 1 year warranty"
        ]
    }

    // Hardcoded seller data
    const seller = {
        name: "Apple Inc.",
        rating: 4.2,
        avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100",
        joinedDate: "29 July, 2022",
        totalProducts: 1221,
        totalReviews: 131
    }

    // Hardcoded reviews
    const reviews = [
        {
            id: 1,
            userName: "John Doe",
            stars: 5,
            comment: "Amazing laptop! The M2 chip is incredibly fast and battery life is outstanding.",
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            userName: "Sarah Smith",
            stars: 4,
            comment: "Great performance but a bit expensive. The display is gorgeous though!",
            createdAt: "2024-01-10"
        },
        {
            id: 3,
            userName: "Mike Johnson",
            stars: 5,
            comment: "Best laptop I've ever owned. Highly recommended for developers and creators.",
            createdAt: "2024-01-05"
        }
    ]



    const renderStars = (count) => (
        Array(5).fill('').map((_, i) => (
            <img
                key={i}
                src={i < Math.round(count) ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="w-4"
            />
        ))
    )

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
            <div className="flex flex-col md:flex-row gap-16 mt-4">
                {/* Product Images */}
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer hover:border-primary transition">
                                <img src={image} alt={`Thumbnail ${index + 1}`}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={product.image[0]} alt="Selected product" width={400} height={400}
                            className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {renderStars(product.averageRating)}
                        <p className="text-base ml-1 text-gray-500">
                            {product.averageRating} ({product.reviewCount} reviews)
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
                                    {renderStars(seller.rating)}
                                    <span className="text-xs text-gray-500">({seller.rating})</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition"
                        >
                            Send Message
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ${product.price}</p>
                        <p className="text-2xl font-medium text-primary">${product.offerPrice}</p>
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
                            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                -
                            </button>
                            <span className="w-8 text-center font-medium">1</span>
                            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                                +
                            </button>
                        </div>
                        {/* Wishlist Button */}
                        <button title="Add To Wishlist" className=" absolute top-7 right-20  w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-full shadow-md border border-zinc-200 group">
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
                        className={`pb-3 text-lg font-medium transition relative ${activeTab === "reviews"
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Product Reviews
                        {activeTab === "reviews" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("seller")}
                        className={`pb-3 text-lg font-medium transition relative ${activeTab === "seller"
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
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
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {renderStars(review.stars)}
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
                            {/* Seller Name & Rating */}
                            <div className="text-center pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800">{seller.name}</h3>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {renderStars(seller.rating)}
                                    <span className="text-sm text-gray-500 ml-1">({seller.rating}) Ratings</span>
                                </div>
                            </div>

                            {/* Seller Description */}
                            <div className="py-6 border-b border-gray-100">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae repellat pariatur inventore reprehenderit minus obcaecati ut ipsa, illo quas magnam excepturi beatae. Deleniti ipsa reiciendis quidem dolores natus, odio perspiciatis.
                                </p>
                            </div>

                            {/* Seller Stats */}
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

                            {/* Visit Shop Button */}
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