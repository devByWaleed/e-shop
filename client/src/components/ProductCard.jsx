import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, index }) => {

    const navigate = useNavigate()

    return (
        <section onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product.id}`); scrollTo(0, 0); }} key={index} className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-4 flex flex-col w-72 md:w-50 relative cursor-pointer">
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
                <img src={product.image_Url[0].url ? product.image_Url[0].url : "https://assets.prebuiltui.com/images/components/card/card-speaker-image.png"} alt={product.category} className="max-h-full max-w-full object-contain" />
            </div>

            <h5 className="pt-3 text-[15px] text-blue-400 pb-3">Seller</h5>

            {/* Product Name */}
            <p className="text-sm text-neutral-500 mb-2 px-2 line-clamp-2 min-h-10 truncate">{product.name}</p>

            {/* Price */}
            <div className="flex items-center gap-2 px-2 mt-auto">
                <span className="text-sm font-semibold text-neutral-800">${product.discount_price}</span>
                <span className="text-xs font-bold text-secondary line-through">${product.price}</span>
                <span className="text-sm p-1 rounded text-accent">{product.total_sell} sold</span>
            </div>
        </section>
    )
}

export default ProductCard