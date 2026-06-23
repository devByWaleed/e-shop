import React, { useState } from 'react';

const ProfileContent = ({ active }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const [userData, setUserData] = useState({
        name: "Shahriar Islam Sajeeb",
        email: "programmershahriarsajeeb@gmail.com",
        phone: "+1 (555) 234-5678",
        zipCode: "94025",
        address1: "123 Innovation Way, Apt 4B",
        address2: "Silicon Valley, CA",
        gender: "Male",
        dob: "1995-06-15",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
    });

    const handleSave = () => {
        setIsEdit(false);
    };

    if (active !== 1) return null;

    return (
        <section className="w-full bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Header / Avatar Block */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div className="relative group">
                    {isEdit ? (
                        <label htmlFor="user-avatar" className="cursor-pointer block relative">
                            <img
                                className="w-24 h-24 object-cover rounded-full border-2 border-primary/40 opacity-80 transition-opacity hover:opacity-60"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="Avatar"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-lg bg-black/20 rounded-full text-white">📷</div>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="user-avatar"
                                hidden
                            />
                        </label>
                    ) : (
                        <img
                            className="w-24 h-24 object-cover rounded-full border border-gray-200 shadow-inner"
                            src={userData.image}
                            alt="Profile"
                        />
                    )}
                </div>

                <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">User Account Settings</p>
                </div>

                <div className="w-full sm:w-auto">
                    {isEdit ? (
                        <button onClick={handleSave} className="w-full bg-primary hover:bg-primary-dull text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
                            Save Profile
                        </button>
                    ) : (
                        <button onClick={() => setIsEdit(true)} className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                            Edit Fields
                        </button>
                    )}
                </div>
            </div>

            {/* Inputs Section Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6">

                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Full Name</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.name}
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Email Address</label>
                    <input
                        type="email"
                        disabled={!isEdit}
                        value={userData.email}
                        onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.phone}
                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Zip Code */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Zip Code</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.zipCode}
                        onChange={(e) => setUserData(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Address 1 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Address 1</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.address1}
                        onChange={(e) => setUserData(prev => ({ ...prev, address1: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Address 2 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Address 2</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.address2}
                        onChange={(e) => setUserData(prev => ({ ...prev, address2: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Gender Identification */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Gender</label>
                    <select
                        disabled={!isEdit}
                        value={userData.gender}
                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Date of Birth</label>
                    <input
                        type="date"
                        disabled={!isEdit}
                        value={userData.dob}
                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>
            </div>
        </section>
    );
};

export default ProfileContent;