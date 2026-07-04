import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard';

const BestDeals = () => {

    const [products, setProducts] = useState([])
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    useEffect(() => {
        if (!allProducts) {
            setProducts([])
            return
        }

        // Spread into a new array before sorting — Array.sort() mutates in place,
        // and mutating the Redux state array directly is a bug (Redux state should
        // be treated as read-only, and mutating it can cause stale/inconsistent renders).
        const sorted = [...allProducts].sort((a, b) => b.soldOut - a.soldOut)
        setProducts(sorted.slice(0, 5))
    }, [allProducts])

    if (productLoading) {
        return <div className="text-center py-12 text-gray-400">Loading deals...</div>;
    }

    if (productError) {
        return <div className="text-center py-12 text-secondary">{productError}</div>;
    }

    return (
        <>
            <section className="bg-white flex flex-col items-center justify-center px-4 py-16">

                <div className="max-w-7xl mx-auto items-start mb-10">
                    <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                        Best <span className="text-primary">Deals</span>
                    </h1>
                    <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
                </div>

                <div className="flex flex-wrap items-center justify-center  gap-5">
                    {products.slice(0, 5).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default BestDeals
