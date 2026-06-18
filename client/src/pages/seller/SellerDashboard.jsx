import React from 'react';

const SellerDashboard = () => {
    const dashData = {
        earnings: "2,342",
        activeListings: "24",
        totalSales: "182",
        latestProducts: [
            { id: 1, name: "Apple MacBook Pro 14\"", price: 1849, date: "12 May 2026", status: "In Stock" },
            { id: 2, name: "Sony WH-1000XM5 Headphones", price: 348, date: "28 Apr 2026", status: "Out of Stock" },
            { id: 3, name: "Nike Air Max 270 Sneakers", price: 129, date: "05 Jun 2026", status: "In Stock" }
        ]
    };

    return (
        <div className='m-5  max-w-6xl text-text'>
            {/* Top Cards Metric Rows */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* Earnings Card */}
                <div className='flex items-center gap-4 bg-white p-5 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all shadow-sm border-light-border'>
                    <div className='p-3 rounded-lg bg-light-bg'>
                        <span className="text-2xl">💰</span>
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-dark'>${dashData.earnings}</p>
                        <p className='text-sm font-medium text-text-muted'>Total Revenue</p>
                    </div>
                </div>

                {/* Listings Card */}
                <div className='flex items-center gap-4 bg-white p-5 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all shadow-sm border-light-border'>
                    <div className='p-3 rounded-lg bg-light-bg'>
                        <span className="text-2xl">📦</span>
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-dark'>{dashData.activeListings}</p>
                        <p className='text-sm font-medium text-text-muted'>Active Products</p>
                    </div>
                </div>

                {/* Sales Card */}
                <div className='flex items-center gap-4 bg-white p-5 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all shadow-sm border-light-border'>
                    <div className='p-3 rounded-lg bg-light-bg'>
                        <span className="text-2xl">📈</span>
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-dark'>{dashData.totalSales}</p>
                        <p className='text-sm font-medium text-text-muted'>Orders Fulfilled</p>
                    </div>
                </div>
            </div>

            {/* Bottom Panel */}
            <div className='bg-white rounded-xl border mt-10 shadow-sm border-light-border'>
                <div className='flex items-center gap-2.5 p-4 border-b bg-light-bg rounded-t-xl border-light-border'>
                    <span className="text-lg">⏱️</span>
                    <p className='font-semibold text-dark'>Recently Added Inventory</p>
                </div>

                <div className="divide-y divide-light-border">
                    {dashData.latestProducts.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-3 hover:bg-light-bg transition-colors">
                            <div className='flex items-start gap-3'>
                                <span className='text-xl mt-0.5'>🏷️</span>
                                <div>
                                    <p className='font-semibold text-base sm:text-sm text-text'>{item.name}</p>
                                    <p className='text-xs text-text-muted'>Added on {item.date}</p>
                                </div>
                            </div>

                            <div className='flex items-center justify-between sm:justify-end gap-6'>
                                <p className='font-bold text-sm text-primary'>${item.price}</p>
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'In Stock'
                                        ? 'bg-accent/10 text-accent-dull'
                                        : 'bg-secondary/10 text-secondary-dull'
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;