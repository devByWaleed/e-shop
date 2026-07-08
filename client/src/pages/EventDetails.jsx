import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../redux/actions/eventAction";
import toast from "react-hot-toast";
import { addToCart } from "../redux/actions/cartAction";

const EventDetails = () => {
    const { seller } = useSelector((state) => state.seller);
    const { allEvents, eventLoading, eventError } = useSelector((state) => state.event);
    const { cart } = useSelector((state) => state.cart);

    const [activeTab, setActiveTab] = useState("overview");
    const [count, setCount] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const eventItem = allEvents?.find((item) => item._id === id);
    const imagesGallery = eventItem?.images?.length > 0 ? eventItem.images : [];

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllEvents());
        }
    }, [dispatch, seller]);

    useEffect(() => {
        if (imagesGallery.length > 0) {
            setSelectedImage(imagesGallery[0]);
        }
    }, [eventItem?._id]);

    useEffect(() => {
        if (!eventItem?.finish_Date) return;

        const targetDate = new Date(eventItem.finish_Date);
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [eventItem?.finish_Date]);

    useEffect(() => {
        setCount(1);
    }, [eventItem?._id]);

    if (eventLoading) {
        return <div className="text-center py-12 text-gray-400">Loading event...</div>;
    }

    if (eventError) {
        return <div className="text-center py-12 text-secondary">{eventError}</div>;
    }

    if (!eventItem) {
        return <div className="text-center py-12">Event not found</div>;
    }

    const shop = eventItem.shop;
    const shopEventCount = allEvents.filter((item) => item.shopId === eventItem.shopId).length;

    const handleCart = () => {
        const isItemExists = cart && cart.find((i) => i._id === eventItem._id);

        if (isItemExists) {
            toast.error("Item already exists!");
        } else {
            if (eventItem.stock < count) {
                toast.error("Event stock limited");
            } else {
                const cartData = { ...eventItem, quantity: count };
                dispatch(addToCart(cartData));
                toast.success("Item added to cart successfully");
            }
        }
    };

    const handleQuantityChange = (amount) => {
        const newQty = count + amount;
        if (newQty <= 0) return;
        if (newQty > eventItem.stock) {
            toast.error("Event stock limited");
            return;
        }
        setCount(newQty);
    };

    return (
        <section className="mt-12 max-w-7xl mx-auto px-4">
            <p className="text-sm text-gray-500">
                <Link to={"/"} className="hover:text-primary">Home</Link> /
                <Link to={"/events"} className="hover:text-primary"> Events</Link> /
                <Link to={`/events?category=${encodeURIComponent(eventItem.category)}`} className="hover:text-primary"> {eventItem.category}</Link> /
                <span className="text-primary"> {eventItem.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-12 mt-4">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-1/2">
                    {imagesGallery.length > 0 ? (
                        <>
                            <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible">
                                {imagesGallery.map((image, index) => {
                                    const imgUrl = typeof image === "string" ? image : image.url;
                                    const isSelected = selectedImage === imgUrl;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(imgUrl)}
                                            className={`border w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden cursor-pointer transition shrink-0 ${isSelected ? "border-primary ring-1 ring-primary" : "border-gray-300/60 hover:border-primary"}`}
                                        >
                                            <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover select-none" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border border-gray-200 w-full aspect-square max-w-120 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                <img src={selectedImage} alt="Selected event preview" className="w-full h-full object-cover transition-all duration-300" />
                            </div>
                        </>
                    ) : (
                        <div className="border border-gray-200 w-full aspect-square max-w-120 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                            No image available
                        </div>
                    )}
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{eventItem.name}</h1>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            🔥 Flash Event
                        </span>
                        <span className="text-sm text-gray-500">{eventItem.status || "running"}</span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mt-4">
                        <div className="flex items-center gap-3">
                            <Link to={`/shop/${shop._id}`}>
                                <img src={shop?.avatar} alt={shop?.name} className="w-12 h-12 rounded-full object-cover" />
                            </Link>
                            <div>
                                <p className="font-medium text-gray-800 hover:text-primary cursor-pointer">{shop?.name}</p>
                                <p className="text-xs text-gray-500">Event seller</p>
                            </div>
                        </div>
                        <button onClick={() => navigate(`/shop/${shop._id}`)} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition">
                            Visit Shop
                        </button>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ${eventItem.originalPrice}</p>
                        <p className="text-2xl font-medium text-primary">${eventItem.discountPrice}</p>
                        <span className="text-gray-500/70 text-xs">(inclusive of all taxes)</span>
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-800">Offer Ends In</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { label: "Days", value: timeLeft.days },
                                { label: "Hours", value: timeLeft.hours },
                                { label: "Minutes", value: timeLeft.minutes },
                                { label: "Seconds", value: timeLeft.seconds },
                            ].map((item) => (
                                <div key={item.label} className="rounded-xl bg-white p-3 text-center shadow-sm border border-gray-100">
                                    <p className="text-xl font-bold text-primary">{String(item.value).padStart(2, "0")}</p>
                                    <p className="text-[11px] uppercase tracking-wide text-gray-500">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-base font-medium mt-6">About Event</p>
                    <ul className="list-disc ml-4 text-gray-500/70 space-y-1">
                        {eventItem.description?.map((desc, index) => (
                            <li key={index} className="marker:text-primary">{desc}</li>
                        ))}
                    </ul>

                    <div className="mt-6 relative">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                        <div className="flex items-center gap-3 mb-4">
                            <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">-</button>
                            <span className="w-8 text-center font-medium">{count}</span>
                            <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">+</button>
                        </div>
                    </div>

                    <div className="flex items-center mt-2 gap-4 text-base">
                        <button onClick={handleCart} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded-lg">
                            Add to Cart
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition rounded-lg">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <div className="flex gap-8 justify-between border-b border-gray-200">
                    <button onClick={() => setActiveTab("overview")} className={`pb-3 text-lg font-medium transition relative ${activeTab === "overview" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                        Event Overview
                        {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                    </button>
                    <button onClick={() => setActiveTab("seller")} className={`pb-3 text-lg font-medium transition relative ${activeTab === "seller" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                        Seller Information
                        {activeTab === "seller" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>}
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === "overview" && (
                        <div className="rounded-2xl border border-gray-200 p-6">
                            <p className="text-gray-600 text-sm leading-relaxed">{eventItem.description?.join(" ")}</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">Category: {eventItem.category}</span>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">Stock: {eventItem.stock}</span>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">Started: {new Date(eventItem.start_Date).toLocaleDateString()}</span>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">Ends: {new Date(eventItem.finish_Date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === "seller" && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md">
                            <div className="text-center pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800">{shop?.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Event partner</p>
                            </div>
                            <div className="py-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Joined On:</span>
                                    <span className="text-gray-800 font-medium">{shop?.createdAt ? new Date(shop.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Total Events:</span>
                                    <span className="text-gray-800 font-medium">{shopEventCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Status:</span>
                                    <span className="text-gray-800 font-medium">{eventItem.status || "running"}</span>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition" onClick={() => navigate(`/shop/${shop._id}`)}>
                                Visit Shop
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
