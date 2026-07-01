import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from 'react-redux';
// Clean, matching React Icons from standard sets
import {
    RxDashboard
} from 'react-icons/rx';
import {
    FiShoppingBag,
    FiPackage,
    FiFolderPlus,
    FiMail,
    FiSettings
} from 'react-icons/fi';
import { MdOutlineLocalOffer, MdOutlinePercent, MdEventNote } from 'react-icons/md';
import { VscNewFile } from 'react-icons/vsc';
import { CiMoneyBill } from 'react-icons/ci';
import { AiOutlineRotateLeft } from 'react-icons/ai';


const DashboardSidebar = ({ active, setActive }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // Cleaned up icons to perfectly match your SellerProfile routing map (IDs 1-11)
    const menuItems = [
        { id: 1, label: "Dashboard", icon: <RxDashboard size={20} /> },
        { id: 2, label: "All Orders", icon: <FiShoppingBag size={20} /> },
        { id: 3, label: "All Products", icon: <FiPackage size={20} /> },
        { id: 4, label: "Create Product", icon: <FiFolderPlus size={20} /> },
        { id: 5, label: "All Events", icon: <MdEventNote size={20} /> },
        { id: 6, label: "Create Event", icon: <VscNewFile size={20} /> },
        { id: 7, label: "Withdraw Money", icon: <CiMoneyBill size={20} /> },
        { id: 8, label: "Shop Inbox", icon: <FiMail size={20} />, path: "/dashboard-inbox" },
        { id: 9, label: "Discount Codes", icon: <MdOutlinePercent size={20} /> },
        { id: 10, label: "Refunds", icon: <AiOutlineRotateLeft size={20} /> },
        { id: 11, label: "Settings", icon: <FiSettings size={20} /> },
    ];

    const handleNavigation = (item) => {
        setActive(item.id);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        /* Mobile: flex-row, horizontal scrolling slider
           Desktop (md): flex-col static sidebar stack */
        <div className="w-full bg-white shadow-sm rounded-xl p-3 md:p-4 md:pt-8 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar border border-gray-100">
            {menuItems.map((item) => {
                const isSelected = active === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                            ? "bg-secondary/10 text-secondary md:bg-gray-50"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                            }`}
                    >
                        <span className={isSelected ? "text-secondary" : "text-gray-400"}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default DashboardSidebar;