import React from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const TONES = {
    danger: { icon: "bg-red-50 text-red-500", button: "bg-red-500 hover:bg-red-600" },
    warning: { icon: "bg-amber-50 text-amber-500", button: "bg-amber-500 hover:bg-amber-600" },
    success: { icon: "bg-green-50 text-green-600", button: "bg-green-600 hover:bg-green-700" },
};

// One modal for every admin action (suspend, reactivate, delete, close, reopen, remove).
// It only draws the screen: all the logic stays in the page that uses it.
const AccountActionModal = ({
    open,
    tone = "danger",
    title,
    description,
    account,
    form = {},
    onFormChange,
    showReason = false,
    checkboxes = [],
    confirmLabel = "Confirm",
    busy = false,
    onConfirm,
    onCancel,
}) => {
    if (!open || !account) return null;

    const style = TONES[tone] || TONES.danger;
    const Icon = tone === "success" ? FiCheckCircle : FiAlertTriangle;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                {/* Title */}
                <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${style.icon}`}>
                        <Icon className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                    </div>
                </div>

                {/* Who is affected */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center gap-3">
                    {account.avatar ? (
                        <img src={account.avatar} alt="Profile Pic" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {(account.name || "?").charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{account.name}</p>
                        <p className="text-xs text-gray-500 truncate">{account.email}</p>
                        <p className="text-xs text-gray-400 font-mono truncate">{account._id}</p>
                    </div>
                </div>

                {/* Optional reason */}
                {showReason && (
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700">Reason (optional)</label>
                        <textarea
                            rows={2}
                            maxLength={200}
                            value={form.reason || ""}
                            onChange={(e) => onFormChange("reason", e.target.value)}
                            placeholder="Only admins can see this"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                    </div>
                )}

                {/* Extra options */}
                {checkboxes.map((box) => (
                    <label key={box.name} className="flex items-start gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(form[box.name])}
                            onChange={(e) => onFormChange(box.name, e.target.checked)}
                            className="mt-1 h-4 w-4 accent-red-500"
                        />
                        <span>
                            <span className="block text-sm font-medium text-gray-800">{box.label}</span>
                            {box.hint && <span className="block text-xs text-gray-500">{box.hint}</span>}
                        </span>
                    </label>
                ))}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        disabled={busy}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy}
                        className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium disabled:opacity-60 ${style.button}`}
                    >
                        {busy ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountActionModal;