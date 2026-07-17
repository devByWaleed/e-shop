import React from 'react';

const StarRating = ({ rating, totalReviews = 0, size = 'md' }) => {
    const safeRating = Math.min(Math.max(rating, 0), 5);
    const ratingPercent = (safeRating / 5) * 100;

    const sizeClasses = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
        xl: 'text-5xl'
    };

    const starSize = sizeClasses[size] || sizeClasses.md;

    // Simple approach: Use inline gradient
    return (
        <div className="flex items-center gap-1">
            <span
                className={`${starSize}`}
                style={{
                    background: `linear-gradient(90deg, #6C63FF ${ratingPercent}%, #e0e0e0 ${ratingPercent}%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'Times, serif'
                }}
                role="img"
                aria-label={`Rating: ${safeRating} out of 5 stars`}
            >
                ★★★★★
            </span>
            {totalReviews > 0 && (
                <span className="text-sm text-gray-500 ml-1">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            )}
        </div>
    );
};

export default StarRating;