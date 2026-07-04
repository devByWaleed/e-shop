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
    const [couponsLoading, setCouponsLoading] = useState(false)
    const [couponsError, setCouponsError] = useState(null)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const couponData = {
            name,
            discountPercentage: Number(discountPercentage),
            minAmount: minAmount ? Number(minAmount) : null,
            maxAmount: maxAmount ? Number(maxAmount) : null,
            selectedProduct: selectedProduct || null,
            shopId: seller?._id
        }

        try {
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

                // Refresh the list so the new coupon shows up immediately
                getCoupons()
            } else {
                toast.error(data.message || "Failed to create coupon code")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getCoupons = async () => {
        setCouponsLoading(true)
        setCouponsError(null)
        try {
            const { data } = await axios.get(`/api/coupon/get-coupons/${seller._id}`)

            if (data.success) {
                setCoupons(data.couponCodes)
            } else {
                setCouponsError(data.message || "Failed to load coupon codes")
            }
        } catch (error) {
            setCouponsError(error.message)
        } finally {
            setCouponsLoading(false)
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this coupon?")) return

        // try {
        //     // NOTE: requires a matching backend route, e.g.
        //     // couponRouter.delete("/delete-coupon/:id", sellerAuth, deleteCoupon)
        //     const { data } = await axios.delete(`/api/coupon/delete-coupon/${id}`)

        //     if (data.success) {
        //         toast.success("Coupon deleted successfully!")
        //         setCoupons((prev) => prev.filter((c) => c._id !== id))
        //     } else {
        //         toast.error(data.message || "Failed to delete coupon")
        //     }
        // } catch (error) {
        //     toast.error(error.message)
        // }
    }

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProducts(seller._id))
        }
        getCoupons()
    }, [seller])

    // Helper to resolve a coupon's linked product name from the allProducts list
    const getProductName = (productId) => {
        if (!productId) return "All Products"
        const match = allProducts?.find((p) => p._id === productId)
        return match ? match.name : "—"
    }

    return (
        <section className="w-full p-4 md:p-8 relative">
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

            {/* Coupons Table / List, structured to match AllEvents.jsx */}
            <div className="bg-white border rounded-xl text-sm shadow-sm border-light-border overflow-hidden">

                {/* Desktop Header Grid */}
                <div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1.5fr_0.8fr] items-center py-4 px-6 border-b font-medium text-text-muted bg-light-bg/30 border-light-border text-left">
                    <p>Coupon Id</p>
                    <p>Name</p>
                    <p>Discount</p>
                    <p>Min Amount</p>
                    <p>Max Amount</p>
                    <p>Product</p>
                    <p className="text-center">Delete</p>
                </div>

                {couponsLoading ? (
                    <div className="p-12 text-center text-text-muted">Loading coupons...</div>
                ) : couponsError ? (
                    <div className="p-12 text-center text-secondary">{couponsError}</div>
                ) : coupons.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">No coupons found.</div>
                ) : (
                    <div className="divide-y divide-light-border max-h-[75vh] overflow-y-auto">
                        {coupons.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col gap-3 p-5 md:grid md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1.5fr_0.8fr] md:items-center hover:bg-light-bg/20 transition-colors text-left text-text"
                            >
                                {/* Mobile Header Block / Desktop ID */}
                                <div className="flex justify-between items-center md:block border-b pb-2 md:pb-0 md:border-none">
                                    <span className="md:hidden font-mono text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                                        ID: {item._id.slice(-6)}
                                    </span>
                                    <p className="hidden md:block text-xs font-mono text-text-muted truncate pr-4" title={item._id}>
                                        {item._id}
                                    </p>

                                    {/* Inline Mobile Quick Action Trash Bucket */}
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className="md:hidden text-text-muted hover:text-secondary p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Name Column */}
                                <div className="flex items-center gap-3 mt-1 md:mt-0">
                                    <p className="font-medium text-base md:text-sm text-dark truncate" title={item.name}>
                                        {item.name}
                                    </p>
                                </div>

                                {/* Discount Column */}
                                <div className="flex justify-between items-center md:block border-t pt-2 md:pt-0 md:border-none border-dashed border-light-border/60">
                                    <span className="md:hidden text-text-muted">Discount:</span>
                                    <p className="font-semibold text-dark md:font-medium md:text-text-muted">
                                        {item.discountPercentage}%
                                    </p>
                                </div>

                                {/* Min Amount Column */}
                                <div className="flex justify-between items-center md:block">
                                    <span className="md:hidden text-text-muted">Min Amount:</span>
                                    <p className="text-text-muted md:text-text">
                                        {item.minAmount != null ? `US$ ${item.minAmount}` : "—"}
                                    </p>
                                </div>

                                {/* Max Amount Column */}
                                <div className="flex justify-between items-center md:block">
                                    <span className="md:hidden text-text-muted">Max Amount:</span>
                                    <p className="text-text-muted md:text-text">
                                        {item.maxAmount != null ? `US$ ${item.maxAmount}` : "—"}
                                    </p>
                                </div>

                                {/* Product Column */}
                                <div className="flex justify-between items-center md:block">
                                    <span className="md:hidden text-text-muted">Product:</span>
                                    <p className="text-text-muted md:text-text truncate" title={getProductName(item.selectedProduct)}>
                                        {getProductName(item.selectedProduct)}
                                    </p>
                                </div>

                                {/* Desktop Delete Column */}
                                <div className="hidden md:block text-center">
                                    <button
                                        onClick={(e) => handleDelete(e, item._id)}
                                        className="p-1.5 rounded text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"
                                        title="Delete Coupon"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                            <option value="" disabled>Choose a selected product</option>
                                            {allProducts && allProducts.map((item) => (
                                                <option key={item._id} value={item._id}>
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
        </section>
    )
}

export default DiscountCodes
