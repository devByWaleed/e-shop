import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getShopOrder } from '../../redux/actions/orderAction';
// import { deleteProduct, getAllProducts } from '../../redux/actions/productAction';

const AllOrders = () => {
    const { seller } = useSelector((state) => state.seller);
    const { shopOrders, orderLoading, orderError } = useSelector((state) => state.order);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (seller?._id) {
            dispatch(getShopOrder(seller._id));
        }
    }, [dispatch, seller]);

    // useEffect(() => {
    //     if (allProducts) {
    //         setProducts(allProducts);
    //     }
    // }, [allProducts]);



    return (
        <section className='w-full max-w-7xl mx-auto p-4 md:p-6'>

            <div className='bg-white border rounded-xl text-sm shadow-sm border-light-border overflow-hidden'>

                {/* Desktop Header Grid */}
                <div className='hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.8fr_0.8fr] items-center py-4 px-6 border-b font-medium text-text-muted bg-light-bg/30 border-light-border text-left'>
                    <p>Product Id</p>
                    <p>Status</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p className='text-center'>Preview</p>
                </div>

                {orderLoading ? (
                    <div className='p-12 text-center text-text-muted'>Loading products...</div>
                ) : orderError ? (
                    <div className='p-12 text-center text-secondary'>{orderError}</div>
                ) : shopOrders.length === 0 ? (
                    <div className='p-12 text-center text-text-muted'>No order found!!</div>
                ) : (
                    <div className='divide-y divide-light-border max-h-[75vh] overflow-y-auto'>
                        {shopOrders.map((item, index) => {
                            // const c = item.category
                            // let categorySlug = c.toLowerCase()
                            // categorySlug = categorySlug.replace(/\s+/g, "-")

                            return (

                                <div
                                    key={item._id}
                                    className='flex flex-col gap-3 p-5 md:grid md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.8fr_0.8fr] md:items-center hover:bg-light-bg/20 transition-colors text-left text-text cursor-pointer'
                                >
                                    {/* Mobile Header Block / Desktop ID */}
                                    <div
                                        onClick={() => navigate(`/order/${item._id}`)}
                                        className='flex justify-between items-center md:block border-b pb-2 md:pb-0 md:border-none'>
                                        <span className='md:hidden font-mono text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded'>
                                            ID: {item._id.slice(-6)}
                                        </span>
                                        <p className='hidden md:block text-xs font-mono text-text-muted truncate pr-4' title={item._id}>
                                            {item._id}
                                        </p>
                                    </div>

                                    {/* Status Column */}
                                    <div className='flex items-center gap-3 mt-1 md:mt-0'>
                                        {/* <img
                                            className='w-10 h-10 object-cover rounded-lg border border-light-border'
                                            src={item.images?.[0]}
                                            alt={item.name}
                                        /> */}
                                        <p className='font-medium text-base md:text-sm text-dark truncate' title={item.status}>
                                            {item.status}
                                        </p>
                                    </div>

                                    {/* Price Column */}
                                    <div className='flex justify-between items-center md:block border-t pt-2 md:pt-0 md:border-none border-dashed border-light-border/60'>
                                        <span className='md:hidden text-text-muted'>Price:</span>
                                        <p className='font-semibold text-dark md:font-medium md:text-text-muted'>
                                            US$ {item.totalPrice}
                                        </p>
                                    </div>

                                    {/* Quantity Column */}
                                    <div className='flex justify-between items-center md:block'>
                                        <span className='md:hidden text-text-muted'>Quantity:</span>
                                        <p className={`font-medium ${item.cart.quantity === 0 ? 'text-secondary font-bold' : 'text-text'}`}>
                                            {item.cart[index].quantity} units
                                        </p>
                                    </div>

                                    {/* Desktop Preview Icon */}
                                    <div className='hidden md:block text-center'>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/order/${item._id}`)}
                                            className='text-text-muted hover:text-primary p-1 transition-colors'
                                            title="Preview Product"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}






                    </div>
                )}
            </div>
        </section>
    );
};

export default AllOrders;