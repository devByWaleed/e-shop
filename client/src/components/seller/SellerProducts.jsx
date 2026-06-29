import React, { useState } from 'react';

const SellerProducts = () => {
    const [products, setProducts] = useState([
        {
            _id: "prod_1",
            name: "Apple MacBook Pro 14\" (M2 Pro, 16GB RAM)",
            category: "Computers & Laptops",
            stock: 15,
            dateAdded: "12 May 2026",
            price: 1849,
            status: "Active",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80"
        },
        {
            _id: "prod_2",
            name: "Sony WH-1000XM5 Headphones",
            category: "Music & Gaming",
            stock: 0,
            dateAdded: "28 Apr 2026",
            price: 348,
            status: "Out of Stock",
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80"
        },
        {
            _id: "prod_3",
            name: "Nike Air Max 270 Sneakers",
            category: "Shoes",
            stock: 12,
            dateAdded: "05 Jun 2026",
            price: 129,
            status: "Active",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80"
        }
    ]);

    const handleArchive = (id) => {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, status: "Archived" } : p));
    };

    return (
        <div className='w-full max-w-6xl m-5 p-4 md:p-0'>
            <p className='mb-4 text-xl font-semibold text-dark'>All Products Inventory</p>

            <div className='bg-white border rounded-xl text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto shadow-sm border-light-border'>
                {/* Desktop Header Grid */}
                <div className='hidden md:grid grid-cols-[0.5fr_3fr_1.5fr_1fr_1.5fr_1fr_1.5fr] items-center py-4 px-6 border-b font-medium text-text-muted bg-light-bg border-light-border'>
                    <p>#</p>
                    <p>Product Details</p>
                    <p>Category</p>
                    <p>Stock</p>
                    <p>Date Added</p>
                    <p>Price</p>
                    <p className='text-center'>Actions</p>
                </div>

                {/* Inventory List Rows */}
                {products.map((item, index) => (
                    <div
                        className='flex flex-col gap-3 p-6 border-b md:grid md:grid-cols-[0.5fr_3fr_1.5fr_1fr_1.5fr_1fr_1.5fr] md:items-center hover:bg-light-bg/50 transition-colors border-light-border'
                        key={item._id}
                    >
                        <p className='hidden md:block text-text-muted'>{index + 1}</p>

                        <div className='flex items-center gap-3'>
                            <img className='w-12 h-12 object-cover rounded-lg border border-light-border' src={item.image} alt="Product" />
                            <p className='font-medium text-base md:text-sm text-text'>{item.name}</p>
                        </div>

                        <div className='flex justify-between items-center md:block'>
                            <span className='md:hidden font-semibold text-text-muted'>Category:</span>
                            <span className='px-2.5 py-0.5 text-xs font-medium rounded-full bg-light-bg text-text'>{item.category}</span>
                        </div>

                        <div className='flex justify-between items-center md:block'>
                            <span className='md:hidden font-semibold text-text-muted'>Stock:</span>
                            <p className={`font-semibold ${item.stock === 0 ? 'text-secondary' : 'text-text'}`}>{item.stock} units</p>
                        </div>

                        <div className='flex justify-between items-center md:block text-text-muted'>
                            <span className='md:hidden font-semibold text-text-muted'>Added:</span>
                            <p>{item.dateAdded}</p>
                        </div>

                        <div className='flex justify-between items-center md:block'>
                            <span className='md:hidden font-semibold text-text-muted'>Price:</span>
                            <p className='font-bold text-base md:text-sm text-primary'>${item.price}</p>
                        </div>

                        <div className='flex justify-end gap-2 mt-2 md:mt-0 md:justify-center'>
                            {item.status === "Archived" ? (
                                <span className='text-xs font-semibold px-3 py-1 rounded bg-light-bg text-text-muted'>Archived</span>
                            ) : item.status === "Out of Stock" ? (
                                <span className='text-xs font-semibold px-3 py-1 rounded bg-secondary/10 text-secondary-dull'>Restock Needed</span>
                            ) : (
                                <div className='flex gap-2 w-full md:justify-center'>
                                    <button
                                        onClick={() => handleArchive(item._id)}
                                        className='flex-1 md:flex-none text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors bg-secondary hover:bg-secondary-dull'
                                    >
                                        Archive
                                    </button>
                                    <button
                                        onClick={() => alert(`Editing: ${item.name}`)}
                                        className='flex-1 md:flex-none text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors bg-accent hover:bg-accent-dull'
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerProducts;