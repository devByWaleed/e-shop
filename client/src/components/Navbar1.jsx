import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import { assets, productData, categories } from '../assets/assets'

const Navbar1 = () => {
    const nav_links = [
        { label: 'Home', to: '/' },
        { label: 'Best Selling', to: '/best-deals' },
        { label: 'Products', to: '/products' },
        { label: 'Events', to: '/events' },
        { label: 'FAQ', to: '/faqs' },
    ]
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchData, setSearchData] = useState("")


    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [showMobileCategories, setShowMobileCategories] = useState(false)
    const searchInputRef = useRef(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isAuthenticated, user, loading } = useSelector((state) => state.user)

    const handleSearchChange = (e) => {
        const term = e.target.value
        setSearchTerm(term)
    }

    const filteredProducts = productData && productData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            {/* ── HEADER ── */}
            <header className="bg-light-bg border-b border-light-border
                px-6 md:px-16 lg:px-24 xl:px-32 py-2.5
                flex items-center justify-between gap-4">

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
                    <img src={assets.zenvio} className='h-12' alt="Zenvio Logo" />
                </NavLink>

                {/* Search */}
                <div className="relative flex-1 max-w-120 hidden sm:flex items-center
                    gap-2.5 bg-white h-10 px-4 rounded-full
                    border-[1.5px] border-primary">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search the products..."
                        className="flex-1 bg-transparent outline-none text-sm
                            text-text placeholder-text-muted"
                    />
                    <button className="w-7 h-7 rounded-full bg-primary flex
                        items-center justify-center shrink-0"
                        aria-label="Search">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="6.5" cy="6.5" r="4.5"
                                stroke="white" strokeWidth="1.4" />
                            <path d="M10 10L14 14" stroke="white"
                                strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </button>

                    {
                        searchTerm && filteredProducts.length !== 0 ? (
                            <div className='absolute left-0 top-full mt-2 w-full max-h-75 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-99999' >
                                {filteredProducts.map((i, index) => {
                                    const d = i.name
                                    const productName = d.replace(/\s+/g, "-")

                                    return (
                                        <Link key={index} to={`/products/${productName}`} onClick={() => setSearchTerm("")}>
                                            <div className="w-full flex items-center py-2.5 px-4 hover:bg-slate-100 transition-colors border-b border-gray-50 last:border-b-0">
                                                <img src={i.image_Url?.[0]?.url || assets.profile} alt="" className='w-10 h-10 mr-3 object-cover rounded shrink-0' />
                                                <span className="text-sm text-text font-medium truncate">{d}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : null
                    }
                </div>

                {/* Become Seller */}
                <button className="hidden sm:flex items-center gap-2 bg-dark
                    hover:bg-dark-dull transition-colors text-white text-sm
                    font-medium px-5 py-2 rounded-full shrink-0 cursor-pointer"
                    onClick={() => {
                        setOpen(false)
                        navigate('/seller-signup')
                    }}>
                    <span className="w-4.5 h-4.5 rounded-full bg-accent
                        flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M5 2v6M2 5h6" stroke="#1A1A2E"
                                strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    Become a Seller
                </button>

                {/* Mobile Toggle */}
                <button onClick={() => setOpen(!open)}
                    className="sm:hidden" aria-label="Menu">
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                        <rect width="21" height="1.5" rx=".75" fill="#6C63FF" />
                        <rect x="8" y="6" width="13" height="1.5"
                            rx=".75" fill="#6C63FF" />
                        <rect x="6" y="13" width="15" height="1.5"
                            rx=".75" fill="#6C63FF" />
                    </svg>
                </button>
            </header>

            {/* ── NAVBAR ── */}
            <nav className="bg-primary px-6 md:px-16 lg:px-24 xl:px-32
                h-16 hidden sm:flex items-center justify-between sticky top-0 z-10000">

                {/* Categories */}
                <div className="relative min-w-45">
                    <select
                        className="w-full flex items-center gap-3 text-white text-sm font-medium pl-10 pr-8 py-4 rounded-xl bg-white/15 border border-white/30 cursor-pointer hover:bg-white/25 hover:border-white/50 transition-all duration-200 appearance-none"
                        defaultValue=""
                        onChange={(e) => {
                            if (e.target.value) {
                                navigate(e.target.value);
                            }
                        }}
                    >
                        <option value="" disabled hidden>Choose Category</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat.value} className="bg-dark text-white/90">
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    {/* Menu Icon (Left side) */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="2.5" width="14" height="1.5" rx=".75" fill="white" />
                            <rect x="4" y="7.25" width="10" height="1.5" rx=".75" fill="white" />
                            <rect x="4" y="12" width="8" height="1.5" rx=".75" fill="white" />
                        </svg>
                    </div>

                    {/* Custom dropdown arrow icon (Right side) */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 group-hover:rotate-180">
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                            <path d="M1 1.5L6 5.5L11 1.5" stroke="white" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>


                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {nav_links.map(({ label, to }) => (
                        <NavLink key={to} to={to}
                            className={({ isActive }) =>
                                `text-sm px-3.5 py-1.5 rounded-full transition-all
                                duration-150 whitespace-nowrap
                                ${isActive
                                    ? 'bg-secondary text-white font-medium'
                                    : 'text-white/80 hover:text-white hover:bg-white/18'
                                }`
                            }>
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-1.5">

                    {/* Wishlist */}
                    <button
                        onClick={() => { navigate("/wishlist") }}
                        className="relative w-9 h-9 rounded-lg bg-white/12
                        flex items-center justify-center cursor-pointer
                        hover:bg-white/20 transition-colors"
                        aria-label="Wishlist">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M10 16.5s-7-4.5-7-8.5a4 4 0 0 1 7-2.646A4
                                4 0 0 1 17 8c0 4-7 8.5-7 8.5z"
                                stroke="white" strokeWidth="1.4"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-secondary
                            text-white text-[10px] font-medium w-4 h-4 rounded-full
                            flex items-center justify-center border-[1.5px] border-primary">
                            2
                        </span>
                    </button>

                    {/* Cart */}
                    <button
                        onClick={() => { navigate("/cart") }}
                        className="relative w-9 h-9 rounded-lg bg-white/12
                        flex items-center justify-center cursor-pointer
                        hover:bg-white/20 transition-colors"
                        aria-label="Cart">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M2 2h2l2.4 10h8.8l1.8-7H6"
                                stroke="white" strokeWidth="1.4"
                                strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="16.5" r="1.2" fill="white" />
                            <circle cx="14" cy="16.5" r="1.2" fill="white" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-secondary
                            text-white text-[10px] font-medium w-4 h-4 rounded-full
                            flex items-center justify-center border-[1.5px] border-primary">
                            1
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-5 mx-1 bg-white/25" aria-hidden="true" />

                    {/* Avatar */}
                    {
                        user ? (
                            <div
                                className="w-9 h-9 rounded-full overflow-hidden cursor-pointer
                                border-2 border-white/40 hover:border-white/70 transition-colors
                                shrink-0"
                                title="Profile"
                            >
                                <img
                                    src={user.avatar ? `${import.meta.env.VITE_BACKEND_URL}/${user.avatar}` : assets.profile}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onClick={() => navigate("/user-profile")}
                                />
                            </div>
                        ) : (
                            <NavLink
                                to="/user-login"
                                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25
                                transition-colors text-white text-sm font-medium px-4 py-1.5
                                rounded-full border border-white/30 whitespace-nowrap"
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="5" r="3" stroke="white" strokeWidth="1.4"
                                        strokeLinecap="round" />
                                    <path d="M2 14c0-3 2.686-5 6-5s6 2 6 5"
                                        stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                                Login
                            </NavLink>
                        )
                    }
                </div>
            </nav>

            {/* ── MOBILE MENU ── */}
            {open && (
                <div className="sm:hidden flex flex-col gap-1 px-5 py-4 text-sm
                    bg-light-bg border-b border-light-border">
                    {nav_links.map(({ label, to }) => (
                        <NavLink key={to} to={to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `py-2 transition-colors
                                ${isActive ? 'text-primary font-medium' : 'text-text'}`
                            }>
                            {label}
                        </NavLink>
                    ))}

                    <button className="mt-2 bg-primary hover:bg-primary-dull
                        transition-colors text-white text-sm font-medium
                        px-5 py-2 rounded-full self-start cursor-pointer"
                        onClick={() => {
                            setOpen(false)
                            navigate('/seller-signup')
                        }}>
                        Become a Seller
                    </button>
                </div>
            )}
        </>
    )
}

export default Navbar1