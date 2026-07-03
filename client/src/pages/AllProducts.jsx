import React, { useEffect, useState } from 'react'
import { productData } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const AllProducts = () => {
    // Make sure you map over 'data' instead of 'products'
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams()
    const activeCategory = searchParams.get("category")

    // const displayedProducts = activeCategory
    //     ? productData.filter(product => product.category === activeCategory)
    //     : productData;

    useEffect(() => {
        if (activeCategory === null) {
            // Use spread operator [...] to avoid mutating the original assets array with .sort()
            const d = productData && [...productData].sort((a, b) => a.total_sell - b.total_sell)
            setData(d)
        } else {
            const d = productData && productData.filter((i) => i.category === activeCategory)
            setData(d)
        }
    }, [activeCategory]) // <-- Fixed: Triggers filter logic whenever the URL parameter changes

    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">

            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                    All <span className="text-primary">Products</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
                {/* Fixed: Map over filtered state 'data' instead of raw static array 'products' */}
                {data.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>

            {data && data.length === 0 ? (
                <h1 className='text-center w-full pb-25 text-20px'>No Products Found!!</h1>
            ) : null}
        </section>
    );
}

export default AllProducts