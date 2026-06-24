import { useState } from 'react';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import UserOrders from '../components/profile/UserOrders';
import UserRefunds from '../components/profile/UserRefunds';
import TrackOrder from '../components/profile/TrackOrder';
import PaymentMethods from '../components/profile/PaymentMethods';
import AddressSettings from '../components/profile/AddressSettings';

const Profile = () => {
    const [active, setActive] = useState(1);

    return (
        <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

                {/* Left Sidebar Menu Component (Stays visible across all tabs) */}
                <div className="w-full md:w-64 lg:w-72 shrink-0">
                    <ProfileSidebar active={active} setActive={setActive} />
                </div>

                {/* Right Content Column (Swaps content panels seamlessly) */}
                <div className="flex-1">
                    {active === 1 && <ProfileContent active={active} setActive={setActive} />}
                    {active === 2 && <UserOrders />}
                    {active === 3 && <UserRefunds />}
                    {active === 5 && <TrackOrder />}
                    {active === 6 && <PaymentMethods />}
                    {active === 7 && <AddressSettings />}
                </div>

            </div>
        </div>
    );
};

export default Profile;