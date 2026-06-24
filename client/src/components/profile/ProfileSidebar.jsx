import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiUser,
    FiShoppingBag,
    FiRotateCcw,
    FiMail,
    FiMapPin,
    FiCreditCard,
    FiHome,
    FiLogOut
} from 'react-icons/fi';
import toast from "react-hot-toast";
import axios from "axios";
import { LoadUserFail } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const ProfileSidebar = ({ active, setActive }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            const { data } = await axios.post("/api/user/logout")

            if (data.success) {
                dispatch(LoadUserFail(null))
                toast.success(data.message)
                navigate("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const menuItems = [
        { id: 1, label: "Profile", icon: <FiUser size={20} /> },
        { id: 2, label: "Orders", icon: <FiShoppingBag size={20} /> },
        { id: 3, label: "Refunds", icon: <FiRotateCcw size={20} /> },
        { id: 4, label: "Inbox", icon: <FiMail size={20} />, path: "/inbox" },
        { id: 5, label: "Track Order", icon: <FiMapPin size={20} /> },
        { id: 6, label: "Payment Methods", icon: <FiCreditCard size={20} /> },
        { id: 7, label: "Address", icon: <FiHome size={20} /> },
        { id: 8, label: "Logout", icon: <FiLogOut size={20} /> },
    ];

    const handleNavigation = (item) => {
        if (item.label === "Logout") {
            logout();
            return;
        }

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

export default ProfileSidebar;