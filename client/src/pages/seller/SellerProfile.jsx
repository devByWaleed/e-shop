import { useState } from 'react';
// Changed to use the DashboardSidebar component you provided
import DashboardSidebar from '../../components/seller/DashboardSidebar';
import CreateProduct from '../../components/seller/CreateProduct';
import AllEvents from '../../components/seller/AllEvents';
import SellerProducts from '../../components/seller/SellerProducts';
import SellerProfileContent from '../../components/seller/SellerProfileContent';
import AllOrders from '../../components/seller/AllOrders';
import DiscountCodes from '../../components/seller/DiscountCodes';
import Refunds from '../../components/seller/Refunds';
import ShopSettings from '../../components/seller/ShopSettings';
import Navbar from '../../components/seller/Navbar';



// Note: Clean up or swap these out later if your seller views differ from user views
const SellerProfile = () => {
    const [active, setActive] = useState(1);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

                    {/* Left Sidebar Menu Component (Dynamic responsive layout) */}
                    <div className="w-full md:w-64 lg:w-72 shrink-0">
                        <DashboardSidebar active={active} setActive={setActive} />
                    </div>

                    {/* Right Content Column (Swaps seller views dynamically based on Sidebar active ID) */}
                    <div className="flex-1 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">

                        {/* ID: 1 - Dashboard Overview */}
                        {active === 1 &&
                            <SellerProfileContent active={active} setActive={setActive} />
                        }

                        {/* ID: 2 - All Orders */}
                        {active === 2 && <AllOrders />}

                        {/* ID: 3 - All Products */}
                        {active === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">All Products</h2>
                                <SellerProducts />
                            </div>
                        )}

                        {/* ID: 4 - Create Product */}
                        {active === 4 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Product</h2>
                                <CreateProduct />
                            </div>
                        )}

                        {/* ID: 5 - All Events */}
                        {active === 5 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">All Events</h2>
                                <AllEvents />
                            </div>
                        )}

                        {/* ID: 6 - Create Event */}
                        {active === 6 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Event</h2>
                                <CreateEvent />
                            </div>
                        )}

                        {/* ID: 7 - Withdraw Money */}
                        {active === 7 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Withdraw Money</h2>
                                <WithdrawMoney />
                            </div>
                        )}

                        {/* ID: 8 - Shop Inbox (Handled mostly via your sidebar router navigate, but caught here as fallback) */}
                        {active === 8 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Inbox</h2>
                            </div>
                        )}

                        {/* ID: 9 - Discount Codes */}
                        {active === 9 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Discount Codes</h2>
                                <DiscountCodes />
                            </div>
                        )}

                        {/* ID: 10 - Refunds */}
                        {active === 10 && <Refunds />}

                        {/* ID: 11 - Settings */}
                        {active === 11 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Settings</h2>
                                <ShopSettings />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default SellerProfile;