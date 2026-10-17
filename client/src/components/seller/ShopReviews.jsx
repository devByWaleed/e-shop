import React from "react";
import { Link } from "react-router-dom";

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};


const Stars = ({ rating = 0, className = "text-base" }) => {
    const rounded = Math.round(Number(rating) || 0);
    return (
        <span className={`inline-flex ${className}`} aria-label={`${rounded} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rounded ? "text-amber-400" : "text-gray-300"}>
                    ★
                </span>
            ))}
        </span>
    );
};


const SummaryCard = ({ summary }) => {
    const breakdown = summary?.breakdown || {};

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-6 sm:items-center">
            {/* Average */}
            <div className="flex flex-col items-center sm:min-w-36">
                <p className="text-4xl font-bold text-gray-900">{summary?.average ?? 0}</p>
                <Stars rating={summary?.average} className="text-xl mt-1" />
                <p className="text-sm text-gray-500 mt-1">
                    {summary?.total ?? 0} {summary?.total === 1 ? "review" : "reviews"}
                </p>
            </div>

            {/* Star breakdown */}
            <div className="flex-1 flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = breakdown[star] || 0;
                    const percent = summary?.total ? (count / summary.total) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                            <span className="w-10 text-gray-600">{star} star</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="w-8 text-right text-gray-500">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const ReviewCard = ({ review }) => {
    const name = review.user?.name || "Customer";
    const avatar = review.user?.avatar;
    const product = review.product;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            {/* Reviewer */}
            <div className="flex items-center gap-3">
                {avatar ? (
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
                <Stars rating={review.rating} />
            </div>

            {/* Comment */}
            {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}

            {/* Product that was reviewed */}
            {product?._id && (
                <Link
                    to={`/products/${encodeURIComponent(product.category || "all")}/${product._id}`}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                >
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded bg-gray-200" />
                    )}
                    <p className="text-xs text-gray-500 line-clamp-1">
                        Reviewed: <span className="text-gray-800 font-medium">{product.name}</span>
                    </p>
                </Link>
            )}
        </div>
    );
};


const ShopReviews = ({ reviews = [], summary = null, loading = false, error = null }) => {
    if (loading && reviews.length === 0) {
        return <p className="text-gray-500 py-8 text-center">Loading reviews...</p>;
    }

    if (error && reviews.length === 0) {
        return <p className="text-red-500 py-8 text-center">{error}</p>;
    }

    if (reviews.length === 0) {
        return <p className="text-gray-500 py-8 text-center">No reviews for this shop yet.</p>;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <SummaryCard summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reviews.map((review, index) => (
                    <ReviewCard key={review._id || index} review={review} />
                ))}
            </div>
        </div>
    );
};

export default ShopReviews;