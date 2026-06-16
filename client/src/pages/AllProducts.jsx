import React from 'react'
import { productData } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const products = productData;

    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">

            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                    All <span className="text-primary">Products</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center  gap-5">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </section>
    );
}

export default AllProducts
