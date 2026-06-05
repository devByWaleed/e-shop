import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const EventProduct = ({ product }) => {

    // Timer state (3 days from now)
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set target date to 3 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(0, 0, 0, 0);

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Safety Guard: If product prop isn't passed or is undefined, stop rendering to avoid crashes
    if (!product) {
        return null;
    }

    // Extract your specific dummy data object values with fallbacks to your original hardcoded defaults
    const categoryName = product.category || "General Electronics";
    const titleName = product.name || "Flash Sale Product";
    const displayPrice = product.discount_price || 999;
    const originalPrice = product.price || (product.discount_price ? product.discount_price + 50 : 1099);
    const unitsSold = product.total_sell !== undefined ? product.total_sell : 0;
    const descriptionText = product.description || "Product details are crucial to make an informed decision...";

    // Extracting the first image safely out of the image_Url array structure
    const mainImage = product.image_Url && product.image_Url[0] && product.image_Url[0].url
        ? product.image_Url[0].url
        : "https://assets.prebuiltui.com/images/components/card/card-lamp-image.png";

    return (
        <div className="max-w-6xl mx-auto  p-6 md:p-8">


            {/* Product Card */}
            <div className="bg-linear-to-br from-white to-[#F8F7FF] rounded-2xl overflow-hidden shadow-xl border border-light-border">
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Left Column - Image Gallery */}
                    <div className="p-6 md:p-8 bg-linear-to-br from-[#F8F7FF] to-white">
                        <div className="relative">
                            {/* Sale Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-linear-to-r from-secondary to-secondary-dull text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    🔥 Limited Deal
                                </div>
                            </div>

                            {/* Product Image */}
                            <div className="flex items-center justify-center p-8">
                                <img
                                    src={mainImage}
                                    alt={titleName}
                                    className="w-full max-w-sm object-contain hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="flex justify-center gap-3 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-16 h-16 rounded-lg border-2 border-light-border hover:border-primary cursor-pointer transition-all p-1">
                                        <img src={mainImage} alt={`Thumbnail ${i}`} className="w-full h-full object-cover rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="p-6 md:p-8 flex flex-col">
                        {/* Category */}
                        <div className="mb-2">
                            <span className="text-primary text-sm font-semibold uppercase tracking-wide">{categoryName}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                            {titleName}
                            <span className="block text-lg font-medium text-text/60 mt-1">8/256GB | Deep Purple</span>
                        </h1>

                        {/* Description */}
                        <p className="text-text/70 leading-relaxed mb-6">
                            {descriptionText}
                        </p>

                        {/* Price Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-dark">${displayPrice}</span>
                                <span className="text-xl text-secondary line-through">${originalPrice}</span>
                                <span className="bg-accent/20 text-accent-dull px-2 py-1 rounded-md text-sm font-semibold">
                                    {unitsSold} sold
                                </span>
                            </div>
                        </div>

                        {/* Timer Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-text font-semibold">Flash Sale Ends In:</span>
                            </div>

                            <div className="flex gap-3">
                                <div className="text-center">
                                    <div className="bg-linear-to-br from-dark to-dark-dull text-white rounded-xl px-4 py-3 min-w-17.5">
                                        <span className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Days</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-linear-to-br from-dark to-dark-dull text-white rounded-xl px-4 py-3 min-w-17.5">
                                        <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Hours</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-linear-to-br from-dark to-dark-dull text-white rounded-xl px-4 py-3 min-w-17.5">
                                        <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Minutes</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-linear-to-br from-secondary to-secondary-dull text-white rounded-xl px-4 py-3 min-w-17.5 animate-pulse">
                                        <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-6 py-3 rounded-xl font-semibold">
                                See Details
                            </button>
                            <button className="flex-1 bg-linear-to-r from-primary to-primary-dull text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventProduct;