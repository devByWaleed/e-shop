import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// Replace this with your actual ProductCard import path
import ProductCard from '../ProductCard';
import { productData } from '../../assets/assets';

const ShopProfileData = ({ isOwner }) => {

    const [activeTab, setActiveTab] = useState(1);

    // Tab Definitions exactly matching image_cc8dfc.png
    const tabs = [
        { id: 1, label: "Shop Products" },
        { id: 2, label: "Running Events" },
        { id: 3, label: "Shop Reviews" },
    ];

    return (
        <div className="w-full flex flex-col">
            {/* Top Bar: Nav Tabs & Dashboard Redirect Button */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">

                {/* Tabs */}
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-base font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer pb-2 relative ${isSelected
                                    ? "text-red-500 border-b-2 border-red-500"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Conditional Go Dashboard Button */}
                {isOwner && (
                    <Link to="/dashboard" className="self-start sm:self-auto">
                        <button className="h-10 px-5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap">
                            Go Dashboard
                        </button>
                    </Link>
                )}
            </div>

            {/* Dynamic Tab Panel Contents */}
            <div className="w-full">

                {/* Panel 1: Shop Products Grid */}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {productData && productData.map((product, index) => (
                            <ProductCard data={product} key={index} isShop={true} />
                        ))}
                        {(!productData || productData.length === 0) && (
                            <p className="text-gray-500 col-span-full py-8 text-center">No products available for this shop yet.</p>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default ShopProfileData;