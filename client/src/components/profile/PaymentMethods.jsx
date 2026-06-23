import React from 'react';
import { FiCreditCard, FiPlus, FiTrash2 } from 'react-icons/fi';

const PaymentMethods = () => {
    // Mock saved user tokens
    const accounts = [
        { id: 1, type: "Visa", last4: "4242", exp: "12/28", holder: "Shahriar Islam Sajeeb", primary: true },
        { id: 2, type: "Mastercard", last4: "8891", exp: "04/29", holder: "Shahriar Islam Sajeeb", primary: false }
    ];

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
            {/* Header element configuration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                        <FiCreditCard size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Payment Methods</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your digital wallets and connected credit accounts</p>
                    </div>
                </div>
                <button className="flex items-center justify-center gap-1.5 self-start sm:self-auto bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                    <FiPlus /> Add Card
                </button>
            </div>

            {/* Saved Wallets Dashboard Cards Flex Grid Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((card) => (
                    <div
                        key={card.id}
                        className={`border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-44 group transition-all bg-linear-to-br ${card.primary
                                ? 'border-gray-900 bg-gray-900 text-white shadow-md shadow-gray-200'
                                : 'border-gray-200 bg-gray-50/40 text-gray-800 hover:border-gray-300'
                            }`}
                    >
                        {/* Upper card content segment label */}
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${card.primary ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-600'
                                    }`}>
                                    {card.type}
                                </span>
                                {card.primary && <span className="text-[10px] font-medium ml-2 text-primary">Primary</span>}
                            </div>

                            <button className={`p-2 rounded-lg transition-colors cursor-pointer ${card.primary
                                    ? 'text-gray-400 hover:text-rose-400 hover:bg-white/10'
                                    : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}>
                                <FiTrash2 size={16} />
                            </button>
                        </div>

                        {/* Mid Hash Account Display layout block */}
                        <div className="my-2">
                            <span className="text-lg tracking-widest font-mono font-medium block">
                                •••• •••• •••• {card.last4}
                            </span>
                        </div>

                        {/* Bottom alignment metadata details view label */}
                        <div className="flex justify-between items-end text-xs opacity-80 font-medium">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider opacity-60">Card Holder</span>
                                <span className="mt-0.5 font-sans font-bold">{card.holder}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] uppercase tracking-wider opacity-60">Expires</span>
                                <span className="mt-0.5 font-mono font-bold">{card.exp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethods;