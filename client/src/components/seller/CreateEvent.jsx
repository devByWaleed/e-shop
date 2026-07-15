import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { categories } from '../../assets/assets'
import { createEventProduct } from '../../redux/actions/eventAction'
import { ClearError, clearEventSuccess } from '../../redux/slices/eventSlice' // Add this import
import toast from "react-hot-toast"

const CreateEvent = () => {
    const { seller } = useSelector((state) => state.seller)
    const { eventSuccess, eventError } = useSelector((state) => state.event)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // State bindings store pure YYYY-MM-DD strings for consistent management
    const [images, setImages] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [originalPrice, setOriginalPrice] = useState(0)
    const [discountPrice, setDiscountPrice] = useState(0)
    const [stock, setStock] = useState(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    // Clear success state on component unmount
    useEffect(() => {
        return () => {
            dispatch(clearEventSuccess())
        }
    }, [dispatch])

    const handleImageChange = (e) => {
        e.preventDefault()
        let files = Array.from(e.target.files)
        setImages((prevImages) => [...prevImages, ...files])
    }

    const handleStartDate = (e) => {
        const selectedStartDate = e.target.value // YYYY-MM-DD string
        setStartDate(selectedStartDate)

        // Automatically wipe out old end dates if they suddenly invalidate your minimum range
        if (endDate && new Date(endDate) < new Date(selectedStartDate)) {
            setEndDate("")
        }
    }

    const handleEndDate = (e) => {
        setEndDate(e.target.value) // YYYY-MM-DD string
    }

    // Date Bounds Setup
    const todayStr = new Date().toISOString().slice(0, 10)

    // Calculate the absolute baseline minimum end date (e.g., 3 days after start date)
    const calculateMinEndDate = () => {
        if (!startDate) return todayStr
        const startDateTime = new Date(startDate).getTime()
        const dynamicMinDate = new Date(startDateTime + 3 * 24 * 60 * 60 * 1000)
        return dynamicMinDate.toISOString().slice(0, 10)
    }

    const minEndDate = calculateMinEndDate()

    const onSubmitHandler = (e) => {
        e.preventDefault()

        if (!seller || !seller._id) {
            toast.error("Seller session expired. Please log in again.");
            return;
        }

        // Validation safeguards
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Finish date cannot be earlier than the start date!")
            return
        }

        const newForm = new FormData()

        images.forEach((image) => {
            newForm.append("images", image)
        })

        const descriptionLines = description
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)

        descriptionLines.forEach((line) => newForm.append("description", line))

        newForm.append("name", name)
        newForm.append("category", category)
        newForm.append("tags", tags)
        newForm.append("originalPrice", originalPrice)
        newForm.append("discountPrice", discountPrice)
        newForm.append("stock", stock)
        newForm.append("start_Date", startDate)
        newForm.append("finish_Date", endDate)
        newForm.append("shopID", seller?._id)
        dispatch(createEventProduct(newForm))
    }

    useEffect(() => {
        if (eventError) {
            toast.error(eventError)
            // Clear error after showing toast
            dispatch(ClearError())
        }

        if (eventSuccess) {
            toast.success("Event Created Successfully")

            // Reset States
            setImages([]);
            setName("");
            setDescription("");
            setCategory("");
            setTags("");
            setOriginalPrice(0);
            setDiscountPrice(0);
            setStock(0);
            setStartDate("")
            setEndDate("")

            // Clear success state before navigation
            dispatch(clearEventSuccess())
            navigate("/seller-profile")
        }
    }, [dispatch, eventError, eventSuccess, navigate])

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white border border-light-border rounded-xl shadow-xs">
            <h2 className="text-xl md:text-2xl font-bold text-dark mb-6">Create Event</h2>

            <form onSubmit={onSubmitHandler} className="space-y-5">
                {/* Event Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text">
                        Event Product Name <span className="text-secondary">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter event product name"
                        className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Event Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text">
                        Event Description <span className="text-secondary">*</span>
                    </label>
                    <textarea
                        rows="4"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter event description details"
                        className="w-full p-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                </div>

                {/* Responsive Row: Category & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Category <span className="text-secondary">*</span>
                        </label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.label}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., promo, winter, sale"
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Responsive Row: Start Date & Finish Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Event Start Date <span className="text-secondary">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            min={todayStr}
                            value={startDate}
                            onChange={handleStartDate}
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Finish Date */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Event Finish Date <span className="text-secondary">*</span>
                        </label>
                        <input
                            id="end-date"
                            type="date"
                            required
                            min={minEndDate}
                            value={endDate}
                            onChange={handleEndDate}
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Responsive Row: Original Price, Discount Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Original Price */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Original Price ($)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            placeholder="0"
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Discount Price */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Discount Price ($) <span className="text-secondary">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            placeholder="0"
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Product Stock */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-text">
                            Event Stock <span className="text-secondary">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="0"
                            className="w-full h-11 px-4 border border-light-border rounded-lg text-sm bg-light-bg text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Upload Images Slot */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-text">
                        Upload Event Images <span className="text-secondary">*</span>
                    </label>
                    <div className="w-full border-2 border-dashed border-light-border rounded-lg p-6 bg-light-bg flex flex-col items-center justify-center transition-colors relative">
                        <input
                            type="file"
                            required={images.length === 0}
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <svg className="w-8 h-8 text-text-muted mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-xs text-text-muted">
                            {images.length > 0 ? `${images.length} file(s) selected` : "Click or drag to upload files"}
                        </span>
                    </div>

                    {/* Rendered Uploaded Images Grid */}
                    {images && images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                            {images.map((i, index) => (
                                <div key={index} className="aspect-square border border-light-border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(i)}
                                        alt="Event Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateEvent