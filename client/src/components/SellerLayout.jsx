import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const SellerLayout = () => {
    return (
        // FIX: Using inline flex-row layouts to ensure components sit side-by-side smoothly
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-light-bg font-sans">
            {/* Persisted left navigation panel */}
            <Sidebar />

            {/* Main workspace container where child elements replace content fields */}
            <div className="flex-1 overflow-x-hidden p-4 md:p-8 flex justify-center items-start">
                <Outlet />
            </div>
        </div>
    );
};

export default SellerLayout;