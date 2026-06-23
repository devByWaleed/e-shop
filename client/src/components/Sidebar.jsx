import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className=" bg-white border-r transition-all duration-300 flex md:flex-col flex-row dow-sm border-light-border"
            style={{ width: isOpen ? '170px' : '70px' }} // Dynamic execution requirement
        >
            {/* Header Area */}
            <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'} border-b border-light-border`}>
                {isOpen && <span className='font-bold text-sm tracking-wide text-primary'>SELLER HUB</span>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-light-bg active:scale-95 transition-all text-lg font-bold border-light-border text-dark'
                    title={isOpen ? "Collapse Menu" : "Expand Menu"}
                >
                    {isOpen ? "«" : "»"}
                </button>
            </div>

            {/* Navigation Routes */}
            <ul className='min-w-screen mt-4 flex md:flex-col flex-row gap-1 px-2'>
                <NavLink
                    className={({ isActive }) => `flex items-center gap-4 py-3 px-3.5 rounded-lg font-medium transition-all cursor-pointer group ${isActive ? 'bg-primary text-white' : 'text-text hover:bg-light-bg'
                        }`}
                    to={`/seller-dashboard`}
                >
                    <span className="text-xl">📊</span>
                    {isOpen && <p className='text-sm transition-opacity duration-200'>Dashboard</p>}
                </NavLink>

                <NavLink
                    className={({ isActive }) => `flex items-center gap-4 py-3 px-3.5 rounded-lg font-medium transition-all cursor-pointer group ${isActive ? 'bg-primary text-white' : 'text-text hover:bg-light-bg'
                        }`}
                    to={`/seller-products`}
                >
                    <span className="text-xl">📦</span>
                    {isOpen && <p className='text-sm transition-opacity duration-200'>My Products</p>}
                </NavLink>

                <NavLink
                    className={({ isActive }) => `flex items-center gap-4 py-3 px-3.5 rounded-lg font-medium transition-all cursor-pointer group ${isActive ? 'bg-primary text-white' : 'text-text hover:bg-light-bg'
                        }`}
                    to={`/seller-profile`}
                >
                    <span className="text-xl">👤</span>
                    {isOpen && <p className='text-sm transition-opacity duration-200'>Seller Profile</p>}
                </NavLink>
            </ul>
        </div>
    );
};

export default Sidebar;