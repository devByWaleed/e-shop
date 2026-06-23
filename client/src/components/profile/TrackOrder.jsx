import React, { useState } from 'react';
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("7463hvbfbhfbrtr28820f83hfb3");

    // Stepper milestone tracker schema data map
    const steps = [
        { title: "Order Placed", desc: "Received on 2026-06-20, 10:14 AM", completed: true },
        { title: "Processing", desc: "Package verification & quality checkpoint clearance", completed: true },
        { title: "On The Way", desc: "In transit via local micro-fulfillment dispatch center", completed: false },
        { title: "Delivered", desc: "Estimated delivery expected within 48 business hours", completed: false }
    ];

    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                    <FiMapPin size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Track Order Status</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time status tracking updates for active shipments</p>
                </div>
            </div>

            {/* Input Tracking Search Panel Grid */}
            <div className="max-w-xl flex flex-col sm:flex-row gap-3 mb-8 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Enter Order Hash ID</label>
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Ex: 7463hvbfbhf..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-700 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                    />
                </div>
                <button className="sm:self-end bg-primary hover:bg-primary-dull text-white text-sm font-medium px-6 py-2.5 rounded-xl h-10.5 transition-all cursor-pointer shadow-sm">
                    Track Live
                </button>
            </div>

            {/* Stepper Timeline UI Graphics Frame */}
            <div className="max-w-md pl-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Tracking Milestones</h4>
                <div className="flex flex-col">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-4 group">
                            {/* Graphic timeline tracking nodes layout line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${step.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200'
                                        : 'bg-white border-gray-200 text-gray-300'
                                    }`}>
                                    {step.completed && <FiCheckCircle size={14} />}
                                </div>
                                {index !== steps.length - 1 && (
                                    <div className={`w-0.5 h-14 my-1 border-l-2 border-dashed ${step.completed ? 'border-emerald-500/60' : 'border-gray-200'
                                        }`} />
                                )}
                            </div>

                            {/* Label nodes metadata layout panel */}
                            <div className="pt-0.5 pb-6">
                                <h5 className={`text-sm font-bold ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {step.title}
                                </h5>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;