import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../redux/actions/productAction';

const BestDealsPage = () => {
    const dispatch = useDispatch();

    const [products, setProducts] = useState([])

    const { allProducts, productLoading, productError } = useSelector((state) => state.product);

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(getAllProducts()); // Triggers the fetch if state is empty
        }
    }, [dispatch, allProducts]);


    useEffect(() => {
        if (!allProducts) {
            setProducts([])
            return
        }

        const sorted = [...allProducts].sort((a, b) => b.soldOut - a.soldOut)
        setProducts(sorted)
    }, [allProducts])


    if (productLoading) {
        return <div className="text-center py-12 text-gray-400">Loading deals...</div>;
    }

    if (productError) {
        return <div className="text-center py-12 text-secondary">{productError}</div>;
    }

    return (
        <section className="bg-white flex flex-col items-center justify-center px-4 py-16">

            <div className="max-w-7xl mx-auto items-start mb-10">
                <h1 className="text-3xl md:text-4xl text-left font-extrabold text-dark">
                    Best <span className="text-primary">Deals</span>
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-400 text-sm py-8">No deals available right now.</p>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-5">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default BestDealsPage;