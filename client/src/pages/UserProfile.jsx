import React, { useState } from 'react';

const UserProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    // Structured e-commerce user dataset mockup
    const [userData, setUserData] = useState({
        name: "Alex Morgan",
        email: "alex.morgan@email.com",
        phone: "+1 (555) 234-5678",
        gender: "Male",
        dob: "1995-06-15",
        address: {
            line1: "123 Innovation Way, Apt 4B",
            line2: "Silicon Valley, CA 94025"
        },
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
    });

    const handleSave = () => {
        // Handle your backend update profile API calls here
        setIsEdit(false);
    };

    return (
        <section className='w-full  bg-white border rounded-2xl p-6 md:p-8 shadow-sm border-light-border text-text'>
            {/* Header / Banner Meta Layout Grid Block */}
            <div className='flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-light-border'>
                <div className='relative group'>
                    {isEdit ? (
                        <label htmlFor="user-avatar" className='cursor-pointer block relative'>
                            <img
                                className='w-28 h-28 object-cover rounded-full border-2 border-primary opacity-80 transition-opacity group-hover:opacity-60'
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="Avatar"
                            />
                            <div className='absolute inset-0 flex items-center justify-center text-xl'>📷</div>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="user-avatar"
                                hidden
                            />
                        </label>
                    ) : (
                        <img
                            className='w-28 h-28 object-cover rounded-full border border-light-border shadow-inner'
                            src={userData.image}
                            alt="Profile"
                        />
                    )}
                </div>

                <div className='text-center sm:text-left flex-1'>
                    {isEdit ? (
                        <input
                            className='bg-light-bg border border-light-border rounded-lg px-3 py-1 text-2xl font-bold text-dark w-full max-w-sm focus:outline-primary'
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    ) : (
                        <h2 className='text-2xl font-bold text-dark'>{userData.name}</h2>
                    )}
                    <p className='text-sm text-text-muted mt-1'>Customer Profile</p>
                </div>

                <div>
                    {isEdit ? (
                        <button onClick={handleSave} className='bg-primary hover:bg-primary-dull text-white font-medium px-6 py-2 rounded-xl transition-all shadow-sm active:scale-95'>
                            Save Changes
                        </button>
                    ) : (
                        <button onClick={() => setIsEdit(true)} className='border border-primary text-primary hover:bg-light-bg font-medium px-6 py-2 rounded-xl transition-all active:scale-95'>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Horizontal 2-Column Responsive Information Grid Split */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
                {/* Left Block Column: Account Details Context Fields */}
                <div className='flex flex-col gap-4'>
                    <p className='text-sm font-bold tracking-wider text-text-muted uppercase mb-1'>Contact Settings</p>

                    <div className='grid grid-cols-3 items-center gap-2'>
                        <span className='font-semibold text-text-muted'>Email Address</span>
                        <span className='col-span-2 font-medium text-dark bg-light-bg/50 px-3 py-1.5 rounded-lg border border-light-border/40 overflow-x-auto'>{userData.email}</span>
                    </div>

                    <div className='grid grid-cols-3 items-center gap-2'>
                        <span className='font-semibold text-text-muted'>Phone Line</span>
                        <div className='col-span-2'>
                            {isEdit ? (
                                <input className='w-full bg-light-bg border border-light-border rounded-lg px-3 py-1.5 focus:outline-primary' type="text" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            ) : (
                                <span className='font-medium text-dark'>{userData.phone}</span>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-3 items-start gap-2 mt-1'>
                        <span className='font-semibold text-text-muted pt-1'>Primary Address</span>
                        <div className='col-span-2 flex flex-col gap-2'>
                            {isEdit ? (
                                <>
                                    <input className='w-full bg-light-bg border border-light-border rounded-lg px-3 py-1.5 focus:outline-primary text-xs' type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                                    <input className='w-full bg-light-bg border border-light-border rounded-lg px-3 py-1.5 focus:outline-primary text-xs' type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                                </>
                            ) : (
                                <p className='text-dark font-medium leading-relaxed bg-light-bg/30 p-2.5 rounded-lg border border-light-border/30 text-xs'>
                                    {userData.address.line1} <br /> {userData.address.line2}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Block Column: Demographic Profile Settings */}
                <div className='flex flex-col gap-4'>
                    <p className='text-sm font-bold tracking-wider text-text-muted uppercase mb-1'>Demographics</p>

                    <div className='grid grid-cols-3 items-center gap-2'>
                        <span className='font-semibold text-text-muted'>Gender Identification</span>
                        <div className='col-span-2'>
                            {isEdit ? (
                                <select className='w-full bg-light-bg border border-light-border rounded-lg px-3 py-1.5 focus:outline-primary' value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                                    <option value="Not Selected">Not Selected</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <span className='font-medium text-dark px-2.5 py-1 bg-light-bg rounded-full text-xs'>{userData.gender}</span>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-3 items-center gap-2'>
                        <span className='font-semibold text-text-muted'>Date of Birth</span>
                        <div className='col-span-2'>
                            {isEdit ? (
                                <input className='w-full bg-light-bg border border-light-border rounded-lg px-3 py-1.5 focus:outline-primary' type="date" value={userData.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
                            ) : (
                                <span className='font-medium text-dark'>{userData.dob}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;