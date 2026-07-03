import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../redux/actions/productAction'
import toast from "react-hot-toast"
import axios from 'axios'

const DiscountCodes = () => {
    const { seller } = useSelector((state) => state.seller)
    // Pulling products to populate the "Selected Product" dropdown menu option
    const { allProducts } = useSelector((state) => state.product)

    const dispatch = useDispatch()

    // Modal visibility controller state variable
    const [open, setOpen] = useState(false)

    // Form Binding states matching CouponSchema
    const [name, setName] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState("")
    const [minAmount, setMinAmount] = useState("")
    const [maxAmount, setMaxAmount] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [coupons, setCoupons] = useState([])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const couponData = {
            name,
            discountPercentage: Number(discountPercentage),
            minAmount: minAmount ? Number(minAmount) : null,
            maxAmount: maxAmount ? Number(maxAmount) : null,
            product: selectedProduct || null,
            shopId: seller?._id
        }

        try {
            // Replace endpoint configuration route payload as needed
            const { data } = await axios.post('/api/coupon/create-coupon', couponData)

            if (data.success) {
                toast.success("Coupon code created successfully!")
                setOpen(false) // Dynamic modal dismissal trigger

                // Reset local states safely
                setName("")
                setDiscountPercentage("")
                setMinAmount("")
                setMaxAmount("")
                setSelectedProduct("")
            } else {
                toast.error(data.message || "Failed to create coupon code")
            }
        } catch (error) {
            toast.error(data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        try {
            // Replace endpoint configuration route payload as needed
            const { data } = axios.get('/api/coupon/get-coupons')

            if (data.success) {
                setCoupons(data.couponCodes)
            } else {
                toast.error(data.message || "Failed to create coupon code")
            }
        } catch (error) {
            toast.error(data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return (
        <div className="w-full p-4 md:p-8 relative">
            {/* Context Section Top Header Panel Wrapper */}
            <div className="w-full flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-dark">All Coupons</h3>
                {/* Reference Black Trigger Button Setup */}
                <button
                    onClick={() => setOpen(true)}
                    className="h-10 px-5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                    Create Coupon Code
                </button>
            </div>

            {/* Standard List / Data Grid Element can safely go here */}
            <div className="text-sm text-text-muted">No coupons found. (0 of 0)</div>

            {/* Backdrop & Modal Overlay Wrapper */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden border border-light-border animate-in fade-in zoom-in-95 duration-150 relative">

                        {/* Close Trigger Icon */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-dark transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold text-dark text-center mb-6">Create Coupon code</h2>

                            <form onSubmit={onSubmitHandler} className="space-y-4">
                                {/* Name Input Element */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-text">
                                        Name <span className="text-secondary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your coupon code name..."
                                        className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Discount Percentage Input Element */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-text">
                                        Discount Percentage <span className="text-secondary">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="100"
                                        value={discountPercentage}
                                        onChange={(e) => setDiscountPercentage(e.target.value)}
                                        placeholder="Enter your coupon code value..."
                                        className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Minimum Purchase Amount Value Limit */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-text">
                                        Min Amount
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        placeholder="Enter your coupon code min amount..."
                                        className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Maximum Total Allowed Value Limit cap */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-text">
                                        Max Amount
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        placeholder="Enter your coupon code max amount..."
                                        className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Selected Product Bind Targeting Field Option */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-text">
                                        Selected Product
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">Choose a selected product</option>
                                            {allProducts && allProducts.map((item) => (
                                                <option key={item._id} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions Submission Controls */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                                    >
                                        {isLoading ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DiscountCodes