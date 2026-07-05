import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/actions/productAction';

const FeaturedProduct = () => {
    const dispatch = useDispatch();
    const [featured, setFeatured] = useState([]);

    // Select from the product slice state instead of the event slice state
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    // Fetch all products from the backend only ONCE if they aren't loaded yet
    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getAllProducts());
        }
    }, [dispatch]); // Safe from infinite fetch loops

    // Algorithmically determine "Featured" by sorting by Newest Arrivals
    useEffect(() => {
        if (!allProducts || !Array.isArray(allProducts)) {
            setFeatured([]);
            return;
        }

        // Clone the array, sort by latest timestamp, and slice the top 5
        const newestArrivals = [...allProducts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        setFeatured(newestArrivals);
    }, [allProducts]);

    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                    Featured <span className="text-primary">Products</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            {/* In-place status states so page structure doesn't disappear */}
            {productLoading && featured.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Loading featured products...</div>
            ) : productError ? (
                <div className="text-center py-12 text-secondary">{productError}</div>
            ) : featured.length === 0 ? (
                <p className="text-gray-400 text-sm py-8">No featured products available right now.</p>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-5">
                    {featured.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedProduct;