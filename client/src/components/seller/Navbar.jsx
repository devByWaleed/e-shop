import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
// Importing respective icons
import {
    AiOutlineGift,
    AiOutlineMessage
} from 'react-icons/ai'
import { MdOutlineEventNote, MdOutlineLocalOffer } from 'react-icons/md'
import { FiShoppingBag } from 'react-icons/fi'

const Navbar = () => {
    const { seller } = useSelector((state) => state.seller)

    return (
        <section className='w-full h-20 bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4 md:px-8'>
            {/* Logo */}
            <div className='shrink-0'>
                <Link to="/dashboard">
                    <img src={assets.zenvio} alt="Logo" className="h-10 w-auto object-contain" />
                </Link>
            </div>

            {/* Navigation Icons & Profile */}
            <div className='flex items-center'>
                <div className='flex items-center gap-2 sm:gap-4 md:gap-6'>

                    {/* Coupons */}
                    <Link to="/dashboard/coupons" title="Coupons">
                        <MdOutlineLocalOffer className="text-2xl text-gray-700 hover:text-primary-dull transition-colors cursor-pointer" />
                    </Link>

                    {/* Events */}
                    <Link to="/dashboard-events" title="Events">
                        <MdOutlineEventNote className="text-2xl text-gray-700 hover:text-primary-dull transition-colors cursor-pointer" />
                    </Link>

                    {/* Products */}
                    <Link to="/dashboard-products" title="Products">
                        <FiShoppingBag className="text-2xl text-gray-700 hover:text-primary-dull transition-colors cursor-pointer" />
                    </Link>

                    {/* Orders */}
                    <Link to="/dashboard-orders" title="Orders">
                        <AiOutlineGift className="text-2xl text-gray-700 hover:text-primary-dull transition-colors cursor-pointer" />
                    </Link>

                    {/* Messages */}
                    <Link to="/dashboard-messages" title="Messages">
                        <AiOutlineMessage className="text-2xl text-gray-700 hover:text-primary-dull transition-colors cursor-pointer" />
                    </Link>

                    {/* Profile Picture (Seller Avatar) */}
                    {seller && (
                        <Link to={`/shop/${seller?._id}`}>
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/${seller?.avatar}`}
                                alt="Seller Profile"
                                className="w-10 h-10 rounded-full border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Navbar