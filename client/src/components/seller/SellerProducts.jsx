import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, getAllProducts } from '../../redux/actions/productAction';

const SellerProducts = () => {
    const { seller } = useSelector((state) => state.seller);
    const { allProducts, productLoading, productError } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProducts(seller._id));
        }
    }, [dispatch, seller]);

    useEffect(() => {
        if (allProducts) {
            setProducts(allProducts);
        }
    }, [allProducts]);

    const handleDelete = (e, id) => {
        e.stopPropagation(); // Prevents clicking the delete button from opening details
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <div className='w-full max-w-7xl mx-auto p-4 md:p-6'>

            <div className='bg-white border rounded-xl text-sm shadow-sm border-light-border overflow-hidden'>

                {/* Desktop Header Grid */}
                <div className='hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.8fr_0.8fr] items-center py-4 px-6 border-b font-medium text-text-muted bg-light-bg/30 border-light-border text-left'>
                    <p>Product Id</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Stock</p>
                    <p>Sold out</p>
                    <p className='text-center'>Preview</p>
                    <p className='text-center'>Delete</p>
                </div>

                {productLoading ? (
                    <div className='p-12 text-center text-text-muted'>Loading products...</div>
                ) : productError ? (
                    <div className='p-12 text-center text-secondary'>{productError}</div>
                ) : products.length === 0 ? (
                    <div className='p-12 text-center text-text-muted'>No products found.</div>
                ) : (
                    <div className='divide-y divide-light-border max-h-[75vh] overflow-y-auto'>
                        {products.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/products/${item.category}/${item._id}`)}
                                className='flex flex-col gap-3 p-5 md:grid md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.8fr_0.8fr] md:items-center hover:bg-light-bg/20 transition-colors text-left text-text cursor-pointer'
                            >
                                {/* Mobile Header Block / Desktop ID */}
                                <div className='flex justify-between items-center md:block border-b pb-2 md:pb-0 md:border-none'>
                                    <span className='md:hidden font-mono text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded'>
                                        ID: {item._id.slice(-6)}
                                    </span>
                                    <p className='hidden md:block text-xs font-mono text-text-muted truncate pr-4' title={item._id}>
                                        {item._id}
                                    </p>

                                    {/* Inline Mobile Quick Action Trash Bucket */}
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className='md:hidden text-text-muted hover:text-secondary p-1'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Name Column */}
                                <div className='flex items-center gap-3 mt-1 md:mt-0'>
                                    <img
                                        className='w-10 h-10 object-cover rounded-lg border border-light-border'
                                        src={item.images?.[0]}
                                        alt={item.name}
                                    />
                                    <p className='font-medium text-base md:text-sm text-dark truncate' title={item.name}>
                                        {item.name}
                                    </p>
                                </div>

                                {/* Price Column */}
                                <div className='flex justify-between items-center md:block border-t pt-2 md:pt-0 md:border-none border-dashed border-light-border/60'>
                                    <span className='md:hidden text-text-muted'>Price:</span>
                                    <p className='font-semibold text-dark md:font-medium md:text-text-muted'>
                                        US$ {item.discountPrice || item.originalPrice}
                                    </p>
                                </div>

                                {/* Stock Column */}
                                <div className='flex justify-between items-center md:block'>
                                    <span className='md:hidden text-text-muted'>Stock left:</span>
                                    <p className={`font-medium ${item.stock === 0 ? 'text-secondary font-bold' : 'text-text'}`}>
                                        {item.stock} units
                                    </p>
                                </div>

                                {/* Sold Out Column */}
                                <div className='flex justify-between items-center md:block'>
                                    <span className='md:hidden text-text-muted'>Total Sold:</span>
                                    <p className='text-text-muted md:text-text'>{item.sold_out || 0}</p>
                                </div>

                                {/* Desktop Preview Icon */}
                                <div className='hidden md:block text-center'>
                                    <button
                                        type="button"
                                        className='text-text-muted hover:text-primary p-1 transition-colors'
                                        title="Preview Product"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Desktop Delete Column */}
                                <div className='hidden md:block text-center'>
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className='p-1.5 rounded text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all'
                                        title="Delete Product"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProducts;