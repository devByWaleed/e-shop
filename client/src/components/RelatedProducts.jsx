import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { productData } from "../assets/assets";
import ProductCard from './ProductCard';

const RelatedProducts = () => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { id } = useParams()
    const productId = Number(id)

    const navigate = useNavigate()

    useEffect(() => {
        const currentProduct = productData.find((item) => item.id === productId)

        if (!currentProduct) {
            setRelatedProducts([])
            return
        }

        const productsCopy = productData.filter(
            (item) =>
                item.category === currentProduct.category &&
                item.id !== currentProduct.id &&
                item.event === false
        )

        setRelatedProducts(productsCopy.slice(0, 5))
    }, [productId])

    return (
        <div className="flex flex-col items-center mt-20">
            <div className="flex flex-col items-center w-max">
                <p className="text-3xl font-medium">Related Products</p>
                <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center  gap-5">
                {relatedProducts.filter((product) => product.category).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>

            <button
                onClick={() => navigate("/products")}
                className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary-dark hover:bg-primary/10 transition">
                See More
            </button>
        </div>
    )
}

export default RelatedProducts
