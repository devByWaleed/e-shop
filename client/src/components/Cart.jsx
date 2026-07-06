import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/actions/cartAction";

const Cart = ({ openCart, setOpenCart }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart } = useSelector((state) => state.cart);
    const currency = "US$";

    const onClose = () => setOpenCart(false);

    // Real-time calculated counters directly driven by global state
    const totalItems = cart && cart.length;

    // (Ensure your product schema properties map to the properties used here)
    const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice
        * item.quantity), 0);

    // Dispatch through the thunk actions (not the raw slice actions) so every
    // quantity change also writes the updated cart to localStorage
    const handleQuantityChange = (productItem, amount) => {
        const newQty = productItem.quantity + amount;

        if (newQty <= 0) {
            dispatch(removeFromCart(productItem._id));
        } else {
            dispatch(addToCart({ ...productItem, quantity: newQty }));
        }
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    // Close drawer overlay via keyboard escape listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (openCart) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openCart]);

    return (
        <>
            {/* Backdrop Dimmed Layer */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-9999 transition-opacity duration-300 ${openCart ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Slide-out Drawer */}
            <aside
                className={`fixed right-0 top-0 h-full w-full sm:w-100 max-w-md bg-white shadow-2xl z-10000 flex flex-col transition-transform duration-300 transform border-l border-gray-200 ${openCart ? "translate-x-0" : "translate-x-full"
                    }`}
                aria-modal="true"
                role="dialog"
                {...{ "aria-label": "Shopping Cart" }}
            >
                {/* Header Section */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-dark font-medium">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-lg font-bold text-dark">{totalItems} items</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-dark transition-colors cursor-pointer"
                        aria-label="Close Cart"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Main Scrollable Items Area */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 px-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                            <p className="text-gray-400 text-sm">Your shopping cart is empty.</p>
                            <button onClick={onClose} className="text-sm font-medium text-primary hover:underline cursor-pointer">
                                Go Back Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const c = item.category;
                            let categorySlug = c.toLowerCase()
                            categorySlug = categorySlug.replace(/\s+/g, "-")

                            return (
                                <div key={item._id} className="flex items-center gap-4 py-5 first:pt-3 last:pb-3 group relative">

                                    {/* Vertical Stepper Controller */}
                                    <div className="flex flex-col items-center justify-between bg-gray-50 rounded-full border border-gray-200 p-0.5 w-7 shrink-0">
                                        <button
                                            onClick={() => handleQuantityChange(item, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-secondary text-white text-sm font-bold shadow-xs hover:brightness-110 active:scale-95 transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                        <span className="text-xs font-bold text-dark py-1.5">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-bold shadow-xs hover:bg-gray-300 active:scale-95 transition cursor-pointer"
                                        >
                                            −
                                        </button>
                                    </div>

                                    {/* Thumbnail Square Image */}
                                    <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded flex items-center justify-center overflow-hidden shrink-0">
                                        <img
                                            className="max-h-full max-w-full object-contain p-1"
                                            src={item?.image || (item?.images && item.images[0])}
                                            alt={item.name}
                                        />
                                    </div>

                                    {/* Content Details */}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4
                                            onClick={() => { setOpenCart(false); navigate(`/products/${categorySlug}/${item._id}`) }}
                                            className="text-xs font-medium text-dark line-clamp-2 leading-tight mb-1.5 pr-2 hover:text-primary cursor-pointer">
                                            {item.name}
                                        </h4>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[11px] text-gray-400 font-normal">
                                                {currency}{item.discountPrice
                                                } &times; {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold text-secondary">
                                                {currency}{item.discountPrice
                                                    * item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Inline Close Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="absolute right-1 top-5 text-gray-400 hover:text-secondary text-xs p-1 transition-colors cursor-pointer"
                                        title="Remove item"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Sticky Action Footer */}
                {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between text-base font-bold text-dark px-1">
                            <span>Subtotal:</span>
                            <span className="text-secondary text-lg">{currency}{subtotal}</span>
                        </div>
                        <button
                            onClick={() => onClose()}
                            className="w-full py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dull transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer text-center"
                        >
                            Proceed To Checkout
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Cart;