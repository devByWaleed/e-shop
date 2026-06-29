import React from 'react';
import ShopInfo from "../../components/seller/ShopInfo";
import ShopProfileData from "../../components/seller/ShopProfileData";

const ShopHomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
            {/* Main Layout Container */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

                {/* Left Column: Shop Info Card (Responsive widths to match sidebar style) */}
                <div className="w-full md:w-64 lg:w-80 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 md:sticky md:top-24 h-auto md:max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
                        <ShopInfo isOwner={true} />
                    </div>
                </div>

                {/* Right Column: Main Profile Data Panel */}
                <div className="flex-1 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                    <ShopProfileData isOwner={true} />
                </div>

            </div>
        </div>
    );
};

export default ShopHomePage;