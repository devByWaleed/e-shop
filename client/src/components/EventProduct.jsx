import { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const EventProduct = () => {
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

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8">
            {/* Section Header with Left-aligned Heading and Right-aligned Link */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                {/* Left side - Heading */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                        Flash <span className="text-[#6C63FF]">Deals</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#6C63FF] rounded-full mt-2"></div>
                    <p className="text-sm text-[#2D2D3A]/50 mt-2">
                        Limited time offers, hurry up!
                    </p>
                </div>

                {/* Right side - See more events link */}
                <NavLink
                    to="/events"
                    className="flex items-center gap-2 text-[#6C63FF] hover:text-[#5A52D5] font-medium transition-colors group"
                >
                    <span>See more events</span>
                    <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </NavLink>
            </div>

            {/* Product Card */}
            <div className="bg-gradient-to-br from-white to-[#F8F7FF] rounded-2xl overflow-hidden shadow-xl border border-[#E0DEFF]">
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Left Column - Image Gallery */}
                    <div className="p-6 md:p-8 bg-gradient-to-br from-[#F8F7FF] to-white">
                        <div className="relative">
                            {/* Sale Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-gradient-to-r from-[#FF6584] to-[#E04E6A] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    🔥 Limited Deal
                                </div>
                            </div>

                            {/* Product Image */}
                            <div className="flex items-center justify-center p-8">
                                <img
                                    src="https://assets.prebuiltui.com/images/components/card/card-lamp-image.png"
                                    alt="iPhone 14 Pro Max"
                                    className="w-full max-w-sm object-contain hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="flex justify-center gap-3 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-16 h-16 rounded-lg border-2 border-[#E0DEFF] hover:border-[#6C63FF] cursor-pointer transition-all p-1">
                                        <img src={`https://assets.prebuiltui.com/images/components/card/card-lamp-image.png`} alt={`Thumbnail ${i}`} className="w-full h-full object-cover rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="p-6 md:p-8 flex flex-col">
                        {/* Category */}
                        <div className="mb-2">
                            <span className="text-[#6C63FF] text-sm font-semibold uppercase tracking-wide">Apple iPhone</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
                            iPhone 14 Pro Max
                            <span className="block text-lg font-medium text-[#2D2D3A]/60 mt-1">8/256GB | Deep Purple</span>
                        </h1>

                        {/* Description */}
                        <p className="text-[#2D2D3A]/70 leading-relaxed mb-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, ducimus eum similique corporis dolor molestias labore accusantium sed accusamus illo voluptate aut reprehenderit sit reiciendis blanditiis doloribus quos cupiditate corrupti.
                        </p>

                        {/* Price Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-[#1A1A2E]">$999</span>
                                <span className="text-xl text-secondary line-through">$1099</span>
                                <span className="bg-[#43E97B]/20 text-[#32C463] px-2 py-1 rounded-md text-sm font-semibold">
                                    100 sold
                                </span>
                            </div>
                        </div>

                        {/* Timer Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-[#FF6584]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-[#2D2D3A] font-semibold">Flash Sale Ends In:</span>
                            </div>

                            <div className="flex gap-3">
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-[#1A1A2E] to-[#12121F] text-white rounded-xl px-4 py-3 min-w-[70px]">
                                        <span className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Days</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-[#1A1A2E] to-[#12121F] text-white rounded-xl px-4 py-3 min-w-[70px]">
                                        <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Hours</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-[#1A1A2E] to-[#12121F] text-white rounded-xl px-4 py-3 min-w-[70px]">
                                        <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Minutes</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-[#FF6584] to-[#E04E6A] text-white rounded-xl px-4 py-3 min-w-[70px] animate-pulse">
                                        <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="text-xs block mt-1">Seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-all duration-300 px-6 py-3 rounded-xl font-semibold">
                                See Details
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-[#6C63FF] to-[#5A52D5] text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventProduct;