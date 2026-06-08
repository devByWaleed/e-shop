import React from 'react'

const RelatedProducts = () => {
    // Hardcoded related products
    const relatedProducts = [
        {
            _id: "2",
            name: "MacBook Air M2",
            offerPrice: 9999,
            image: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300"],
            inStock: true,
            category: "Electronics"
        },
        {
            _id: "3",
            name: "iPad Pro M2",
            offerPrice: 8999,
            image: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300"],
            inStock: true,
            category: "Electronics"
        },
        {
            _id: "4",
            name: "iPhone 15 Pro",
            offerPrice: 12999,
            image: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300"],
            inStock: true,
            category: "Electronics"
        },
        {
            _id: "5",
            name: "Apple Watch Series 9",
            offerPrice: 4999,
            image: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300"],
            inStock: true,
            category: "Electronics"
        },
        {
            _id: "6",
            name: "AirPods Pro 2",
            offerPrice: 2499,
            image: ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300"],
            inStock: true,
            category: "Electronics"
        }
    ]

    return (
        <div className="flex flex-col items-center mt-20">
            <div className="flex flex-col items-center w-max">
                <p className="text-3xl font-medium">Related Products</p>
                <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center  gap-5">
                {relatedProducts.map((item, index) => (
                    <div key={index} className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-4 flex flex-col w-50 relative">
                        {/* Action Buttons - Column layout on top left */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                            {/* Quick View Button */}
                            {/* <button className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white transition-all duration-200 rounded-full shadow-md border border-zinc-200 group">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button> */}

                            {/* Add to Cart Button */}
                            <button className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-dark hover:text-white transition-all duration-200 rounded-full shadow-md border border-zinc-200 group">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2H4L5 12H19L21 4H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>

                            {/* Wishlist Button */}
                            <button className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-full shadow-md border border-zinc-200 group">
                                <svg width="12" height="14" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z" stroke="#27272a" className="group-hover:stroke-red-500 transition-colors" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Product Image - Centered with more top padding to accommodate buttons */}
                        <div className="flex items-center justify-center h-32 mb-2 pt-4">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                        </div>

                        <h5 className="pt-3 text-[15px] text-blue-400 pb-3">Seller</h5>

                        {/* Product Name */}
                        <p className="text-sm text-neutral-500 mb-2 px-2 line-clamp-2 min-h-10 truncate">{item.name}</p>

                        {/* Price */}
                        <div className="flex items-center gap-2 px-2 mt-auto">
                            <span className="text-sm font-semibold text-neutral-800">{item.price}</span>
                            <span className="text-xs font-bold text-secondary line-through">{item.oldPrice}</span>
                            <span className="text-sm p-1 rounded text-accent">55 sold</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary-dark hover:bg-primary/10 transition">
                See More
            </button>
        </div>
    )
}

export default RelatedProducts
