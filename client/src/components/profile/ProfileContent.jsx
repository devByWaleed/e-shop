import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/actions/userAction';
import toast from 'react-hot-toast'

const ProfileContent = ({ active }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [password, setPassword] = useState("");

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: 0,
        zipCode: "",
        address1: "",
        address2: "",
        city: "",
        country: "",
        image: ""
    });

    // Sync state configuration safely when data becomes available or shifts
    useEffect(() => {
        if (user) {
            const addr = user.addresses && user.addresses[0] ? user.addresses[0] : {};
            setUserData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phoneNumber || 0,
                zipCode: addr.zipCode || "",
                address1: addr.address1 || "",
                address2: addr.address2 || "",
                city: addr.city || "",
                country: addr.country || "",
                image: user.avatar
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!password) {
            alert("Please enter your current password to verify updates.");
            return;
        }

        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("password", password);
        formData.append("phoneNumber", userData.phone);
        formData.append("address1", userData.address1);
        formData.append("address2", userData.address2);
        formData.append("zipCode", userData.zipCode);
        formData.append("city", userData.city);
        formData.append("country", userData.country);

        if (image) {
            formData.append("file", image);
        }

        const result = await dispatch(updateUser(formData));
        if (result && result.success) {
            toast.success("Profile successfully altered!");
            setIsEdit(false);
            setPassword("");
            setImage(false);
        } else {
            alert(result?.message || "An error occurred while updating profile.");
        }
    };

    if (active !== 1) return null;

    return (
        <section className="w-full bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div className="relative group">
                    {isEdit ? (
                        <label htmlFor="user-avatar" className="cursor-pointer block relative">
                            <img
                                className="w-24 h-24 object-cover rounded-full border-2 border-primary/40 opacity-80 transition-opacity hover:opacity-60"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="Avatar Preview"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-lg bg-black/20 rounded-full text-white">📷</div>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="user-avatar"
                                hidden
                                accept="image/*"
                            />
                        </label>
                    ) : (
                        <img
                            className="w-24 h-24 object-cover rounded-full border border-gray-200 shadow-inner"
                            src={userData.image}
                            alt="Profile Avatar"
                        />
                    )}
                </div>

                <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{userData.name || "User Name"}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">User Account Settings</p>
                </div>

                <div className="w-full sm:w-auto">
                    {isEdit ? (
                        <div className="flex gap-2">
                            <button onClick={() => { setIsEdit(false); setPassword(""); setImage(false); }} className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-primary hover:bg-primary-dull text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
                                Save Profile
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEdit(true)} className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                            Edit Fields
                        </button>
                    )}
                </div>
            </div>

            {/* Matrix Form Block */}
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

                {/* City */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">City</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.city}
                        onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Country */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Country</label>
                    <input
                        type="text"
                        disabled={!isEdit}
                        value={userData.country}
                        onChange={(e) => setUserData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Password field required to authorize profiles updates */}
                {isEdit && (
                    <div className="flex flex-col gap-1.5 md:col-span-2 bg-primary-50/40 p-4 border border-primary-200/60 rounded-xl mt-2 animate-fadeIn">
                        <label className="text-xs font-bold text-primary">Confirm Current Password</label>
                        <p className="text-xs text-primary mb-1">Enter your password below to securely authorize these structural account profile updates.</p>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-primary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-dull transition-colors"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfileContent;