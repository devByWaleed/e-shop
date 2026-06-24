import React from 'react';
import { FiHome, FiPlus, FiTrash2 } from 'react-icons/fi';

const AddressSettings = () => {
    // Mock address dataset based exactly on your "image_8c19a2.png" layout reference
    const addresses = [
        {
            id: "addr_1",
            tag: "Default",
            addressLine: "494 Erdman Pasaage, New Zoietown, Paraguay",
            phone: "(213) 840-9416"
        },
        {
            id: "addr_2",
            tag: "Office",
            addressLine: "123 Business Boulevard, Ste 400, Asunción, Paraguay",
            phone: "(213) 555-0199"
        }
    ];

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">

            {/* --- HEADER CONTEXT FRAME --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                        <FiHome size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">My Addresses</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your shipping and delivery destinations</p>
                    </div>
                </div>

                {/* Add New Button matching "image_8c19a2.png" */}
                <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer self-start sm:self-auto">
                    <FiPlus size={14} /> Add New
                </button>
            </div>

            {/* --- ADDRESSES LIST CONTAINER --- */}
            <div className="flex flex-col gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="bg-white border border-gray-200/70 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                    >
                        {/* Left Side: Tag Label & Details Context Grid */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 flex-1 min-w-0">

                            {/* Address Type Tag (e.g., Default, Office) */}
                            <div className="w-fit">
                                <span className={`text-xs font-bold px-3 py-1 rounded-md tracking-wide ${addr.tag === 'Default'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200/60'
                                    }`}>
                                    {addr.tag}
                                </span>
                            </div>

                            {/* Full Address String Text block */}
                            <div className="text-sm font-medium text-gray-700 truncate max-w-xl md:pr-4">
                                {addr.addressLine}
                            </div>
                        </div>

                        {/* Right Side: Contact Numbers & Destructive Tools Layout */}
                        <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">

                            {/* Phone Number Field */}
                            <span className="text-sm font-medium text-gray-500 font-sans">
                                {addr.phone}
                            </span>

                            {/* Delete Action Button */}
                            <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                                <FiTrash2 size={16} />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Empty State Fallback (If no addresses exist) */}
            {addresses.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-sm text-gray-400">You haven't saved any addresses yet.</p>
                </div>
            )}

        </div>
    );
};

export default AddressSettings;