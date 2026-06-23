import React from 'react';
import { FiRotateCcw, FiEye } from 'react-icons/fi';

const UserRefunds = () => {
    // Mock refund history records
    const refunds = [
        {
            id: "rf_84920m39dhb7f83hfb3",
            orderId: "7463hvbfbhfbrtr28820f83hfb3",
            status: "Succeeded",
            amount: 120
        },
        {
            id: "rf_1048dhfuryfncpe84920m39",
            orderId: "1048dhfuryfncpe84920m39dhb7",
            status: "Processing",
            amount: 45
        }
    ];

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'succeeded':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200/60';
        }
    };

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                        <FiRotateCcw size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Refund Requests</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Track returned items and currency balance updates</p>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Refund ID</th>
                            <th className="py-4 px-4">Original Order ID</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {refunds.map((refund) => (
                            <tr key={refund.id} className="hover:bg-gray-50/40 transition-colors group">
                                <td className="py-4 px-6 font-mono text-xs text-gray-500 max-w-45 truncate">{refund.id}</td>
                                <td className="py-4 px-4 font-mono text-xs text-gray-400 max-w-45 truncate">{refund.orderId}</td>
                                <td className="py-4 px-4">
                                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-md border ${getStatusStyle(refund.status)}`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900">US$ {refund.amount}</td>
                                <td className="py-4 px-6 text-center">
                                    <button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer">
                                        <FiEye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {refunds.map((refund) => (
                    <div key={refund.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusStyle(refund.status)}`}>
                                {refund.status}
                            </span>
                            <span className="text-sm font-bold text-gray-900">US$ {refund.amount}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            <div><span className="text-gray-400">Refund ID:</span> <span className="font-mono">{refund.id}</span></div>
                            <div className="mt-0.5"><span className="text-gray-400">Order ID:</span> <span className="font-mono">{refund.orderId}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRefunds;