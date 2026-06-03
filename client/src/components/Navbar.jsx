import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [showMobileCategories, setShowMobileCategories] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage and system preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            return savedTheme === 'dark'
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })
    const searchInputRef = useRef(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, user, loading } = useSelector((state) => state.user)

    // Apply dark mode class to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode])

    // Auto focus search input when shown on mobile
    useEffect(() => {
        if (showMobileSearch && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [showMobileSearch])

    const categories = [
        { label: 'All Categories', value: '' },
        { label: '📱 Electronics', value: '/category/electronics' },
        { label: '👕 Fashion', value: '/category/fashion' },
        { label: '🏠 Home & Decor', value: '/category/home-decor' },
        { label: '📚 Books', value: '/category/books' },
        { label: '⚽ Sports & Outdoors', value: '/category/sports' },
        { label: '🎮 Toys & Games', value: '/category/toys' },
        { label: '💄 Beauty & Health', value: '/category/beauty' },
        { label: '🚗 Automotive', value: '/category/automotive' },
        { label: '🐾 Pet Supplies', value: '/category/pet-supplies' },
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search)}`)
            setShowMobileSearch(false)
            setSearch('')
        }
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    return (
        <>
            {/* ── HEADER ── */}
            <header className="bg-light-bg dark:bg-dark/95 border-b border-light-border dark:border-dark-dull
                px-4 md:px-16 lg:px-24 xl:px-32 py-2.5
                flex items-center justify-between gap-3 transition-colors duration-300">

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
                    <img src={assets.zenvio} className='h-10 md:h-12' alt="Zenvio Logo" />
                </NavLink>

                {/* Desktop Search - Hidden on mobile */}
                <div className="hidden md:flex flex-1 max-w-120 items-center
                    gap-2.5 bg-white dark:bg-dark/50 h-10 px-4 rounded-full
                    border-[1.5px] border-primary dark:border-primary/50">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                        placeholder="Search the products..."
                        className="flex-1 bg-transparent outline-none text-sm
                            text-text dark:text-white/80 placeholder-text-muted dark:placeholder-white/40"
                    />
                    <button onClick={handleSearch}
                        className="w-7 h-7 rounded-full bg-primary flex
                        items-center justify-center shrink-0"
                        aria-label="Search">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="6.5" cy="6.5" r="4.5"
                                stroke="white" strokeWidth="1.4" />
                            <path d="M10 10L14 14" stroke="white"
                                strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Become Seller */}
                <button className="hidden md:flex items-center gap-2 bg-dark
                    hover:bg-dark-dull dark:bg-primary dark:hover:bg-primary-dull
                    transition-colors text-white text-sm
                    font-medium px-5 py-2 rounded-full shrink-0 cursor-pointer">
                    <span className="w-4.5 h-4.5 rounded-full bg-accent
                        flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M5 2v6M2 5h6" stroke="#1A1A2E"
                                strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    Become a Seller
                </button>

                {/* Desktop Theme Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-full
                        bg-primary/10 dark:bg-white/10 hover:bg-primary/20 dark:hover:bg-white/20
                        transition-colors cursor-pointer"
                    aria-label="Toggle theme"
                >
                    {darkMode ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Mobile Icons Group */}
                <div className="flex md:hidden items-center gap-3">
                    {/* Mobile Theme Toggle */}
                    <button onClick={toggleDarkMode}
                        className="text-primary dark:text-white/80" aria-label="Toggle theme">
                        {darkMode ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* Mobile Search Toggle */}
                    <button onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="text-primary dark:text-white/80" aria-label="Search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="10" cy="10" r="7" />
                            <path d="M15 15L21 21" />
                        </svg>
                    </button>

                    {/* Mobile Wishlist */}
                    <button className="relative" aria-label="Wishlist"
                        onClick={() => navigate('/wishlist')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5">
                            <path d="M20 8.5c0 4-8 11.5-8 11.5S4 12.5 4 8.5a5.5 5.5 0 0 1 9.5-3.8A5.5 5.5 0 0 1 20 8.5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-secondary
                            text-white text-[9px] font-medium w-3.5 h-3.5 rounded-full
                            flex items-center justify-center">
                            2
                        </span>
                    </button>

                    {/* Mobile Cart */}
                    <button className="relative" aria-label="Cart"
                        onClick={() => navigate('/cart')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5">
                            <path d="M2 2h2l2.4 10h8.8l1.8-7H6" />
                            <circle cx="9" cy="19" r="1.5" />
                            <circle cx="17" cy="19" r="1.5" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-secondary
                            text-white text-[9px] font-medium w-3.5 h-3.5 rounded-full
                            flex items-center justify-center">
                            1
                        </span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setOpen(!open)} aria-label="Menu">
                        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                            <rect width="21" height="1.5" rx=".75" fill="#6C63FF" />
                            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#6C63FF" />
                            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#6C63FF" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Search Bar - Shown when search icon clicked */}
            {showMobileSearch && (
                <div className="md:hidden bg-light-bg dark:bg-dark/95 px-4 py-3 border-b border-light-border dark:border-dark-dull">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 bg-white dark:bg-dark/50 h-10 px-4 rounded-full
                                border border-primary dark:border-primary/50 outline-none text-sm
                                text-text dark:text-white/80"
                        />
                        <button type="submit"
                            className="bg-primary text-white px-4 rounded-full text-sm font-medium">
                            Search
                        </button>
                        <button type="button"
                            onClick={() => setShowMobileSearch(false)}
                            className="text-text/60 dark:text-white/60 px-2">
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* ── DESKTOP NAVBAR ── */}
            <nav className="bg-primary dark:bg-primary/90 px-6 md:px-16 lg:px-24 xl:px-32
                h-16 hidden md:flex items-center justify-between sticky top-0 z-50">

                {/* Categories Dropdown - Desktop */}
                <div className="relative min-w-45">
                    <select
                        className="w-full flex items-center gap-3 text-white text-sm font-medium pl-10 pr-8 py-4 rounded-xl bg-white/15 border border-white/30 cursor-pointer hover:bg-white/25 hover:border-white/50 transition-all duration-200 appearance-none"
                        defaultValue=""
                        onChange={(e) => {
                            if (e.target.value) {
                                navigate(e.target.value)
                            }
                        }}
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat.value} className="bg-dark dark:bg-dark/95 text-white/90">
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="2.5" width="14" height="1.5" rx=".75" fill="white" />
                            <rect x="4" y="7.25" width="10" height="1.5" rx=".75" fill="white" />
                            <rect x="4" y="12" width="8" height="1.5" rx=".75" fill="white" />
                        </svg>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                            <path d="M1 1.5L6 5.5L11 1.5" stroke="white" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {[
                        { label: 'Home', to: '/' },
                        { label: 'Best Selling', to: '/best-selling' },
                        { label: 'Products', to: '/products' },
                        { label: 'Events', to: '/events' },
                        { label: 'FAQ', to: '/faq' },
                    ].map(({ label, to }) => (
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

                {/* Desktop Icons */}
                <div className="flex items-center gap-1.5">
                    <button className="relative w-9 h-9 rounded-lg bg-white/12
                        flex items-center justify-center hover:bg-white/20 transition-colors"
                        onClick={() => navigate('/wishlist')}>
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

                    <button className="relative w-9 h-9 rounded-lg bg-white/12
                        flex items-center justify-center hover:bg-white/20 transition-colors"
                        onClick={() => navigate('/cart')}>
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

                    <div className="w-px h-5 mx-1 bg-white/25" />

                    {user ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer
                            border-2 border-white/40 hover:border-white/70 transition-colors
                            shrink-0"
                            onClick={() => navigate('/profile')}>
                            <img src={user.avatar ? `${import.meta.env.VITE_BACKEND_URL}/${user.avatar}` : assets.profile}
                                alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <NavLink to="/login"
                            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25
                            transition-colors text-white text-sm font-medium px-4 py-1.5
                            rounded-full border border-white/30 whitespace-nowrap">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="5" r="3" stroke="white" strokeWidth="1.4" />
                                <path d="M2 14c0-3 2.686-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.4" />
                            </svg>
                            Login
                        </NavLink>
                    )}
                </div>
            </nav>

            {/* ── MOBILE MENU ── */}
            {open && (
                <div className="md:hidden fixed inset-0 z-50 bg-light-bg dark:bg-dark/95">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-dull">
                        <img src={assets.zenvio} className='h-8' alt="Zenvio Logo" />
                        <button onClick={() => setOpen(false)} className="text-text dark:text-white/80">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Categories Section */}
                    <div className="p-4 border-b border-light-border dark:border-dark-dull">
                        <button
                            onClick={() => setShowMobileCategories(!showMobileCategories)}
                            className="w-full flex items-center justify-between py-2">
                            <span className="font-semibold text-text dark:text-white/80">Categories</span>
                            <svg className={`w-5 h-5 transition-transform ${showMobileCategories ? 'rotate-180' : ''} text-text dark:text-white/80`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        {showMobileCategories && (
                            <div className="mt-2 space-y-1">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (cat.value) navigate(cat.value)
                                            setOpen(false)
                                            setShowMobileCategories(false)
                                        }}
                                        className="block w-full text-left py-2 px-2 text-sm text-text/70 dark:text-white/60 hover:text-primary hover:bg-primary/5 rounded">
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="p-4 border-b border-light-border dark:border-dark-dull">
                        <div className="space-y-2">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Best Selling', to: '/best-selling' },
                                { label: 'Products', to: '/products' },
                                { label: 'Events', to: '/events' },
                                { label: 'FAQ', to: '/faq' },
                            ].map(({ label, to }) => (
                                <NavLink key={to} to={to}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 px-2 rounded transition-colors
                                        ${isActive ? 'text-primary font-medium bg-primary/5' : 'text-text dark:text-white/70 hover:bg-primary/5'}`
                                    }>
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="p-4 space-y-3">
                        <button onClick={() => {
                            setOpen(false)
                            navigate('/become-seller')
                        }}
                            className="w-full bg-dark dark:bg-primary hover:bg-dark-dull dark:hover:bg-primary-dull
                            transition-colors text-white text-sm font-medium
                            px-5 py-2.5 rounded-full">
                            Become a Seller
                        </button>

                        {!user ? (
                            <button onClick={() => {
                                setOpen(false)
                                navigate('/login')
                            }}
                                className="w-full bg-primary hover:bg-primary-dull
                                transition-colors text-white text-sm font-medium
                                px-5 py-2.5 rounded-full">
                                Login / Sign Up
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer
                                    border-2 border-primary"
                                    onClick={() => navigate('/profile')}>
                                    <img src={user.avatar ? `${import.meta.env.VITE_BACKEND_URL}/${user.avatar}` : assets.profile}
                                        alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text dark:text-white/80 font-medium">{user?.name || 'User'}</p>
                                    <p className="text-xs text-text/50 dark:text-white/40">{user?.email}</p>
                                </div>
                                <button className="text-secondary hover:text-secondary-dull text-sm">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar