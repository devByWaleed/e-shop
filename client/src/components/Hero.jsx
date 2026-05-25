import React, { useState } from 'react';

const HeroSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Product images (replace with your actual product images)
    const productImages = [
        {
            src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=689&auto=format&fit=crop",
            alt: "Premium Smart Watch",
            category: "Electronics"
        },
        {
            src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop",
            alt: "Trendy Sneakers",
            category: "Fashion"
        },
        {
            src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop",
            alt: "Wireless Headphones",
            category: "Audio"
        },
        {
            src: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1160&auto=format&fit=crop",
            alt: "Designer Handbag",
            category: "Accessories"
        }
    ];

    return (
        <section className="bg-linear-to-b from-light-bg via-[#FFFBEE] to-[#E6EFFF]">

            {/* Hero Main Content */}
            <main className="flex flex-col md:flex-row items-center max-md:text-center justify-between  pb-16 px-6 sm:px-10 md:px-24 max-w-7xl mx-auto w-full">
                {/* Left Content */}
                <div className="flex flex-col items-center md:items-start">
                    {/* Badge */}
                    <button className="mt-8 md:mt-16 mb-6 flex items-center space-x-2 border border-primary text-primary text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-primary/5 transition" type="button">
                        <span>✨ Limited Time Offer</span>
                        <span className="flex items-center justify-center size-6 p-1 rounded-full bg-primary">
                            <svg width="14" height="11" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 6.5h14M9.5 1 15 6.5 9.5 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>

                    {/* Main Heading */}
                    <h1 className="text-dark font-bold text-4xl sm:text-5xl md:text-6xl max-w-xl leading-tight">
                        Discover Your
                        <span className="text-primary block">Perfect Style</span>
                    </h1>

                    <p className="mt-6 text-text/70 max-w-md text-base leading-relaxed">
                        Shop millions of products from trusted sellers worldwide.
                        Quality guaranteed, prices unbeatable, delivery lightning fast.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center mt-8 gap-4">
                        <button className="bg-primary text-white px-8 pr-3 py-3 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-[#5A52E0] transition shadow-lg hover:shadow-xl" type="button">
                            <span>Shop Now</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <a className="text-primary bg-primary/10 px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/20 transition" href="#">
                            Explore Collections →
                        </a>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-6 mt-8 pt-4 border-t border-primary/10">
                        <div className="flex items-center gap-2">
                            <span className="text-accent text-xl">✓</span>
                            <span className="text-xs text-text/60">100% Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-accent text-xl">🚚</span>
                            <span className="text-xs text-text/60">Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-accent text-xl">⭐</span>
                            <span className="text-xs text-text/60">4.8/5 Rating</span>
                        </div>
                    </div>
                </div>

                {/* Right - Product Images Grid */}
                <div className="mt-12 md:mt-0">
                    <div className="grid grid-cols-2 gap-5 pb-6">
                        {productImages.map((product, index) => (
                            <div key={index} className="group relative">
                                <img
                                    alt={product.alt}
                                    className="w-40 h-48 sm:w-44 sm:h-52 rounded-2xl hover:scale-105 transition duration-300 object-cover shadow-xl hover:shadow-2xl cursor-pointer"
                                    src={product.src}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-dark/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-3">
                                    <span className="text-white text-xs font-medium bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </section>
    );
};

export default HeroSection;