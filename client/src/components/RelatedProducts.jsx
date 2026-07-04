import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const RelatedProducts = () => {
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    const [relatedProducts, setRelatedProducts] = useState([]);
    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        if (!allProducts) {
            setRelatedProducts([])
            return
        }

        const currentProduct = allProducts.find((item) => item._id === id)

        if (!currentProduct) {
            setRelatedProducts([])
            return
        }

        const productsCopy = allProducts.filter(
            (item) =>
                item.category === currentProduct.category &&
                item._id !== currentProduct._id
        )

        setRelatedProducts(productsCopy.slice(0, 5))
    }, [id, allProducts])

    if (productLoading) {
        return <div className="text-center py-12 text-gray-400">Loading related products...</div>;
    }

    return (
        <div className="flex flex-col items-center mt-20">
            <div className="flex flex-col items-center w-max">
                <p className="text-3xl font-medium">Related Products</p>
                <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
            </div>

            {relatedProducts.length === 0 ? (
                <p className="text-gray-400 text-sm py-8">No related products found.</p>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-5">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            <button
                onClick={() => navigate("/products")}
                className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary-dark hover:bg-primary/10 transition">
                See More
            </button>
        </div>
    )
}

export default RelatedProducts