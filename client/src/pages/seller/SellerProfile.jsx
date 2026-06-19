import React, { useState } from 'react';

const SellerProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    // Initial structure matching the specified e-commerce seller instance object schema
    const [sellerData, setSellerData] = useState({
        name: "Apple Inc.",
        rating: 4.2,
        joinedDate: "29 July, 2022",
        totalProducts: 1221,
        totalReviews: 131,
        supportEmail: "merchant-ops@apple.com",
        warehouseLocation: "Cupertino, California, USA",
        avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&auto=format&fit=crop&q=80"
    });

    const handleSave = () => {
        setIsEdit(false);
    };

    return (
        <div className="w-full m-auto bg-white border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border-light-border text-text">

            {/* Header Identity Bar - Flex Wrap for Mobile Responsiveness */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-light-border text-center sm:text-left">
                <div className="relative group">
                    {isEdit ? (
                        <label htmlFor="seller-avatar" className="cursor-pointer block relative">
                            <img
                                className="w-24 h-24 object-cover rounded-xl border-2 border-primary opacity-80 transition-opacity hover:opacity-60 shadow-sm"
                                src={image ? URL.createObjectURL(image) : sellerData.avatar}
                                alt="Store Brand"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-lg bg-black/20 text-white rounded-xl">📷</div>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="seller-avatar"
                                hidden
                            />
                        </label>
                    ) : (
                        <img
                            className="w-24 h-24 object-cover rounded-xl border border-light-border bg-light-bg p-1 shadow-sm"
                            src={sellerData.avatar}
                            alt="Merchant Brand"
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {isEdit ? (
                        <input
                            className="bg-light-bg border border-light-border rounded-lg px-3 py-1.5 text-xl sm:text-2xl font-bold text-dark w-full max-w-sm focus:outline-primary"
                            type="text"
                            value={sellerData.name}
                            onChange={(e) => setSellerData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    ) : (
                        <h2 className="text-xl sm:text-2xl font-bold text-dark truncate">{sellerData.name}</h2>
                    )}
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-1.5 text-xs font-medium text-text-muted">
                        <span className="px-2 py-0.5 rounded bg-light-bg border border-light-border text-primary font-semibold">Verified Merchant</span>
                        <span>Joined: {sellerData.joinedDate}</span>
                    </div>
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    {isEdit ? (
                        <button onClick={handleSave} className="w-full sm:w-auto bg-primary hover:bg-primary-dull text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm">
                            Save Storefront
                        </button>
                    ) : (
                        <button onClick={() => setIsEdit(true)} className="w-full sm:w-auto border border-primary text-primary hover:bg-light-bg font-medium px-6 py-2.5 rounded-xl transition-all active:scale-95 text-sm">
                            Configure Store
                        </button>
                    )}
                </div>
            </div>

            {/* Performance Stats Cards - Scaled into 1 column on mobile, 3 columns on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-light-bg border border-light-border/40">
                <div className="text-center py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-light-border/70 last:border-0">
                    <p className="text-xl md:text-2xl font-bold text-dark">{sellerData.rating} ⭐</p>
                    <p className="text-2xs md:text-xs font-semibold text-text-muted uppercase tracking-wider mt-0.5">Store Rating</p>
                </div>
                <div className="text-center py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-light-border/70 last:border-0">
                    <p className="text-xl md:text-2xl font-bold text-primary">{sellerData.totalProducts}</p>
                    <p className="text-2xs md:text-xs font-semibold text-text-muted uppercase tracking-wider mt-0.5">Total Items</p>
                </div>
                <div className="text-center py-2 sm:py-0 last:border-0">
                    <p className="text-xl md:text-2xl font-bold text-dark">{sellerData.totalReviews}</p>
                    <p className="text-2xs md:text-xs font-semibold text-text-muted uppercase tracking-wider mt-0.5">Reviews Count</p>
                </div>
            </div>

            {/* Main Operational Settings - Scaled into a clean horizontal grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4">

                {/* Left Block: Registration and Support details */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold tracking-wider text-text-muted uppercase border-b border-light-bg pb-1">Corporate Registration</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 text-sm">
                        <span className="font-semibold text-text-muted">Merchant Desk</span>
                        <div className="sm:col-span-2">
                            {isEdit ? (
                                <input
                                    className="w-full bg-light-bg border border-light-border rounded-lg px-3 py-2 focus:outline-primary text-sm"
                                    type="email"
                                    value={sellerData.supportEmail}
                                    onChange={(e) => setSellerData(prev => ({ ...prev, supportEmail: e.target.value }))}
                                />
                            ) : (
                                <span className="font-medium text-dark text-sm break-all bg-light-bg/30 px-2 py-1.5 rounded-lg block border border-light-border/20">{sellerData.supportEmail}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Block: Shipping and Distribution details */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold tracking-wider text-text-muted uppercase border-b border-light-bg pb-1">Logistics Coordination</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-center gap-1 sm:gap-4 text-sm">
                        <span className="font-semibold text-text-muted">Distribution Base</span>
                        <div className="sm:col-span-2">
                            {isEdit ? (
                                <input
                                    className="w-full bg-light-bg border border-light-border rounded-lg px-3 py-2 focus:outline-primary text-sm"
                                    type="text"
                                    value={sellerData.warehouseLocation}
                                    onChange={(e) => setSellerData(prev => ({ ...prev, warehouseLocation: e.target.value }))}
                                />
                            ) : (
                                <span className="font-medium text-dark text-sm bg-light-bg/30 px-2 py-1.5 rounded-lg block border border-light-border/20 leading-relaxed">{sellerData.warehouseLocation}</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerProfile;