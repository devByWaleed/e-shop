import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Country, City } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { user } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart);

    const initialAddress = user?.addresses?.[0] || {};
    const navigate = useNavigate();

    // Form States
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        zipCode: initialAddress.zipCode || '',
        countryCode: '',
        countryName: '',
        city: '',
        address1: initialAddress.address1 || '',
        address2: initialAddress.address2 || '',
    });

    const [coupon, setCoupon] = useState('');
    const [couponCodeData, setCouponCodeData] = useState(null);
    const [countriesList, setCountriesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const currency = "US$";

    // 1. Calculations
    const subtotal = cart ? cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0) : 0;

    // Updated Shipping Cost Logic
    const shipping = subtotal > 500 ? 0 : 50;

    const discount = couponCodeData
        ? (subtotal * (couponCodeData.discountPercentage / 100))
        : 0;

    const total = subtotal + shipping - discount;

    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountriesList(allCountries);

        if (initialAddress.country) {
            const matchedCountry = allCountries.find(
                (c) => c.name.toLowerCase() === initialAddress.country.toLowerCase()
            );
            if (matchedCountry) {
                setFormData((prev) => ({
                    ...prev,
                    countryCode: matchedCountry.isoCode,
                    countryName: matchedCountry.name,
                }));
            }
        }
    }, [user]);

    useEffect(() => {
        if (formData.countryCode) {
            const cities = City.getCitiesOfCountry(formData.countryCode);
            setCitiesList(cities || []);

            if (initialAddress.city) {
                const matchedCity = cities.find(
                    (city) => city.name.toLowerCase() === initialAddress.city.toLowerCase()
                );
                if (matchedCity) {
                    setFormData((prev) => ({ ...prev, city: matchedCity.name }));
                }
            }
        } else {
            setCitiesList([]);
        }
    }, [formData.countryCode, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (e) => {
        const selectedCode = e.target.value;
        const selectedCountry = countriesList.find(c => c.isoCode === selectedCode);
        setFormData((prev) => ({
            ...prev,
            countryCode: selectedCode,
            countryName: selectedCountry ? selectedCountry.name : '',
            city: ''
        }));
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!coupon.trim()) {
            toast.error("Please enter a coupon code!");
            return;
        }
        try {
            const { data } = await axios.get(`/api/coupon/get-coupon-value/${coupon.trim()}`);
            if (data.success && data.couponName) {
                const couponData = data.couponName;
                if (subtotal < couponData.minAmount) {
                    toast.error(`Minimum order amount for this coupon is ${currency}${couponData.minAmount}`);
                    setCouponCodeData(null);
                    return;
                }
                setCouponCodeData(couponData);
                toast.success(`Coupon "${couponData.name}" applied successfully! (${couponData.discountPercentage}% OFF)`);
            } else {
                toast.error("Coupon code doesn't exist!");
                setCouponCodeData(null);
                setCoupon("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid coupon code!");
            setCouponCodeData(null);
            setCoupon("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Object matching your frontend requirements and DB schema properties
        const orderData = {
            shippingAddress: formData,
            cart: cart,
            user: user,
            totalPrice: total,
            subtotalPrice: subtotal,
            shippingPrice: shipping,
            discountPrice: discount,
            appliedCoupon: couponCodeData ? couponCodeData.name : null
        };

        // Saving to Local Storage
        localStorage.setItem("latestOrder", JSON.stringify(orderData));

        // Directing user to the Payment Interface page
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Progress Step Bar */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 text-xs sm:text-sm font-medium">
                    <div className="bg-[#ff3b57] text-white px-4 py-1.5 rounded-full shadow-sm">1. Shipping</div>
                    <div className="h-px w-8 sm:w-16 bg-pink-200"></div>
                    <div className="bg-pink-50 text-[#ff3b57] px-4 py-1.5 rounded-full opacity-70">2. Payment</div>
                    <div className="h-px w-8 sm:w-16 bg-pink-200"></div>
                    <div className="bg-pink-50 text-[#ff3b57] px-4 py-1.5 rounded-full opacity-70">3. Success</div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Zip Code</label>
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Country</label>
                                <select name="countryCode" value={formData.countryCode} onChange={handleCountryChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors text-gray-700" required>
                                    <option value="">Choose your country</option>
                                    {countriesList.map((country) => (
                                        <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">City</label>
                                <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.countryCode} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed" required>
                                    <option value="">Choose your City</option>
                                    {citiesList.map((city, index) => (
                                        <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Address1</label>
                                <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500">Address2</label>
                                <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>subtotal:</span>
                                <span className="font-bold text-gray-900">{currency}{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>shipping:</span>
                                <span className="font-medium text-gray-900">
                                    {shipping === 0 ? "Free" : `${currency}${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 pb-4 border-b border-gray-100">
                                <span>Discount:</span>
                                <span className="font-medium text-green-600">
                                    {discount > 0 ? `-${currency}${discount.toFixed(2)}` : "-"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-base text-gray-800 font-bold mb-2">
                                <span>Total:</span>
                                <span className="text-lg text-gray-900">{currency}{total.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <input type="text" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors" />
                                <button type="button" onClick={handleApplyCoupon} className="w-full border border-red-200 hover:bg-red-50 text-[#ff3b57] font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer">Apply code</button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#ff3b57] hover:bg-[#e02e48] text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                            Continue to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;