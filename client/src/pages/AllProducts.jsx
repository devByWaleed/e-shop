import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/actions/productAction';

const AllProducts = () => {
    const dispatch = useDispatch();
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    const [data, setData] = useState([])
    const [searchParams] = useSearchParams()
    const activeCategory = searchParams.get("category")

    // Fetch products from backend on mount
    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getAllProducts());
        }
    }, [dispatch, allProducts]);

    // Handle filtering safely (lowercasing handles string mismatch bugs)
    useEffect(() => {
        if (!allProducts) {
            setData([])
            return
        }

        if (!activeCategory) {
            setData([...allProducts])
        } else {
            setData(allProducts.filter((i) => i.category?.toLowerCase() === activeCategory.toLowerCase()))
        }
    }, [activeCategory, allProducts])

    if (productLoading) {
        return <div className="text-center py-12 text-gray-400">Loading products...</div>;
    }

    if (productError) {
        return <div className="text-center py-12 text-secondary">{productError}</div>;
    }

    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">

            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                    All <span className="text-primary">Products</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            {data.length === 0 ? (
                <h1 className="text-center w-full pb-25 text-xl">No Products Found!!</h1>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-5">
                    {data.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default AllProducts