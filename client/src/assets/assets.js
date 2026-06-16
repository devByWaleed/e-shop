import show_password from "./eye.svg"
import hide_password from "./eye-slash.svg"
import profile from "./person-circle.svg"
import search from "./search_icon.svg"
import cart from "./cart_icon.svg"
import zenvio from "./zenvio.webp"


export const assets = {
    show_password,
    hide_password,
    profile,
    search,
    cart,
    zenvio
};


// FAQs
export const faqs = [
    {
        question: "How do I become a seller on your marketplace?",
        answer: "To become a seller, click on 'Become a Seller' button on our homepage or in the navigation bar. Fill out the registration form with your business details, verify your email, and complete the seller onboarding process. Once approved, you can start listing your products immediately."
    },
    {
        question: "Is my personal and payment information secure?",
        answer: "Yes, we take security seriously. We use industry-standard SSL encryption for all transactions, never store complete credit card details on our servers, and comply with PCI DSS standards. Your personal information is protected by our privacy policy and never shared with third parties without your consent."
    },
    {
        question: "How are seller ratings and reviews calculated?",
        answer: "Seller ratings are based on multiple factors including product quality, shipping speed, customer service response time, and overall buyer satisfaction. Reviews are verified from actual purchases only. The average rating is calculated from the last 12 months of transactions for accuracy."
    },
    {
        question: "What happens if my item arrives damaged or defective?",
        answer: "If your item arrives damaged or defective, contact the seller within 48 hours of delivery through your order page. Provide photos of the damage. The seller must respond within 24 hours. If unresolved, our buyer protection team will step in to issue a full refund or replacement."
    },
    {
        question: "How do I apply discount codes or promo vouchers?",
        answer: "You can apply discount codes during checkout in the 'Order Summary' section. Enter your promo code in the 'Gift card or discount code' field and click 'Apply'. The discount will be reflected immediately in your total. Note that only one promo code can be used per order."
    },
    {
        question: "What is your price match guarantee policy?",
        answer: "We offer price matching on identical products found at lower prices on competitor websites within 7 days of your purchase. To request a price match, contact customer support with a link to the competitor's listing. The product must be in stock and sold by an authorized retailer."
    }
];


// categories data
export const categoriesData = [
    {
        id: 1,
        title: "Computers and Laptops",
        subTitle: "",
        image_Url:
            "https://cdn.shopify.com/s/files/1/1706/9177/products/NEWAppleMacbookProwithM1ProChip14InchLaptop2021ModelMKGQ3LL_A_16GB_1TBSSD_custommacbd.jpg?v=1659592838",
    },
    {
        id: 2,
        title: "cosmetics and body care",
        subTitle: "",
        image_Url:
            "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2021-07/kosme1.png",
    },
    {
        id: 3,
        title: "Accesories",
        subTitle: "",
        image_Url:
            "https://img.freepik.com/free-vector/ordering-goods-online-internet-store-online-shopping-niche-e-commerce-website-mother-buying-babies-clothes-footwear-toys-infant-accessories_335657-2345.jpg?w=2000",
    },
    {
        id: 4,
        title: "Cloths",
        subTitle: "",
        image_Url:
            "https://www.shift4shop.com/2015/images/industries/clothing/clothing-apparel.png",
    },
    {
        id: 5,
        title: "Shoes",
        subTitle: "",
        image_Url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvBQPQMVNRd6TtDkGs2dCri0Y-rxKkFOiEWw&usqp=CAU",
    },
    {
        id: 6,
        title: "Gifts",
        subTitle: "",
        image_Url:
            "https://securecdn.pymnts.com/wp-content/uploads/2014/11/Gifts-Photo-700x489.jpg",
    },
    {
        id: 7,
        title: "Pet Care",
        subTitle: "",
        image_Url: "https://cdn.openpr.com/T/c/Tc15444071_g.jpg",
    },
    {
        id: 8,
        title: "Mobile and Tablets",
        subTitle: "",
        image_Url:
            "https://st-troy.mncdn.com/mnresize/1500/1500/Content/media/ProductImg/original/mpwp3tua-apple-iphone-14-256gb-mavi-mpwp3tua-637986832343472449.jpg",
    },
    {
        id: 9,
        title: "Music and Gaming",
        subTitle: "",
        image_Url:
            "https://static.vecteezy.com/system/resources/previews/011/996/555/original/3d-black-headphone-illustration-ecommerce-icon-png.png",
    },
    {
        id: 10,
        title: "Others",
        subTitle: "",
        image_Url:
            "https://searchspring.com/wp-content/uploads/2022/10/Hero-Image-Platform-Others-2.png",
    },
];


// Hardcoded reviews
export const reviews = [
    {
        id: 1,
        userName: "John Doe",
        stars: 5,
        comment: "Amazing laptop! The M2 chip is incredibly fast and battery life is outstanding.",
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        userName: "Sarah Smith",
        stars: 4,
        comment: "Great performance but a bit expensive. The display is gorgeous though!",
        createdAt: "2024-01-10"
    },
    {
        id: 3,
        userName: "Mike Johnson",
        stars: 5,
        comment: "Best laptop I've ever owned. Highly recommended for developers and creators.",
        createdAt: "2024-01-05"
    }
]


export const seller = {
    name: "Apple Inc.",
    rating: 4.2,
    avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100",
    joinedDate: "29 July, 2022",
    totalProducts: 1221,
    totalReviews: 131
}


// Organized and updated Product Data
export const productData = [
    // ==========================================
    // --- COMPUTERS & LAPTOPS (5 Products) ---
    // ==========================================
    {
        id: 1,
        bestDeal: true,
        featured: true,
        event: false,
        category: "Computers and Laptops",
        name: "Apple MacBook Pro 14\" (M2 Pro, 16GB RAM, 512GB SSD) - Space Gray",
        description: [
            "Supercharged by the Apple M2 Pro chip",
            "Delivers exceptional performance plug-in or on battery",
            "Stunning 14-inch Liquid Retina XDR display",
            "16GB unified memory",
            "512GB high-speed SSD storage",
            "Space Gray premium finish"
        ],
        image_Url: [{ public_id: "mac_pro_14", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Apple Official", shop_avatar: { public_id: "avatar_apple", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" }, ratings: 4.9 },
        price: 1999,
        discount_price: 1849,
        rating: 5,
        total_sell: 142,
        stock: 15,
    },
    {
        id: 2,
        bestDeal: true,
        featured: false,
        event: true,
        category: "Computers and Laptops",
        name: "Apple MacBook Air 13\" (M2 Chip, 8GB RAM, 256GB SSD) - Midnight",
        description: [
            "Strikingly thin and lightweight design",
            "Impressive speed and power efficiency with Apple M2 chip",
            "Durable aluminum enclosure",
            "Built to handle productivity tasks effortlessly on the move",
            "8GB unified memory",
            "256GB SSD storage",
            "Midnight deep color profile"
        ],
        image_Url: [{ public_id: "mac_air_13", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Apple Official", shop_avatar: { public_id: "avatar_apple", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" }, ratings: 4.9 },
        price: 1099,
        discount_price: 999,
        rating: 4.5,
        total_sell: 320,
        stock: 25,
    },
    {
        id: 3,
        bestDeal: false,
        featured: true,
        event: false,
        category: "Computers and Laptops",
        name: "Dell XPS 13 Laptop - Intel Core i7, 16GB RAM, 512GB SSD",
        description: [
            "Premium chassis build quality",
            "Stunning 4-sided InfinityEdge display",
            "Exceptional raw performance with Intel Core i7",
            "Top-tier portability engineered for modern professionals",
            "16GB RAM for seamless multitasking",
            "512GB NVMe SSD storage"
        ],
        image_Url: [{ public_id: "dell_xps", url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Dell Outlet", shop_avatar: { public_id: "avatar_dell", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.4 },
        price: 1349,
        discount_price: 1249,
        rating: 4,
        total_sell: 88,
        stock: 8,
    },
    {
        id: 4,
        bestDeal: false,
        featured: false,
        event: false,
        category: "Computers and Laptops",
        name: "ASUS ROG Zephyrus G14 Gaming Laptop - AMD Ryzen 9, RTX 4060",
        description: [
            "High-octane gaming meets ultra-portable structure",
            "Incredible 120Hz high refresh rate display",
            "Massive graphical capabilities with NVIDIA RTX 4060",
            "Driven by AMD Ryzen 9 processing architecture",
            "Wrapped inside a compact 14-inch performance chassis"
        ],
        image_Url: [{ public_id: "asus_rog", url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "PC Zone", shop_avatar: { public_id: "avatar_pczone", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.6 },
        price: 1599,
        discount_price: 1499,
        rating: 4.5,
        total_sell: 54,
        stock: 12,
    },
    {
        id: 5,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Computers and Laptops",
        name: "HP Pavilion x360 2-in-1 Touchscreen Laptop - Intel i5, 8GB RAM",
        description: [
            "Extremely versatile 360-degree mechanical hinge",
            "Seamless adaptivity between laptop, tent, and tablet modes",
            "Perfect layout for student configurations and daily streaming",
            "Intel Core i5 processing core",
            "8GB RAM and responsive touch controls"
        ],
        image_Url: [{ public_id: "hp_pav", url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Mega Electronics", shop_avatar: { public_id: "avatar_mega", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.1 },
        price: 799,
        discount_price: 679,
        rating: 4,
        total_sell: 95,
        stock: 30,
    },

    // ==========================================
    // --- MOBILE & TABLETS (5 Products) ---
    // ==========================================
    {
        id: 6,
        bestDeal: true,
        featured: true,
        event: false,
        category: "Mobile and Tablets",
        name: "Apple iPhone 14 Pro Max - 256GB, Silver",
        description: [
            "Features Dynamic Island interactive layout notifications",
            "Advanced 48MP main triple camera setup",
            "Highly efficient A16 Bionic computing processor chip",
            "Generous 256GB internal storage capacity",
            "Premium surgical-grade stainless steel and glass design"
        ],
        image_Url: [{ public_id: "iphone_14_silver", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Amazon Ltd", shop_avatar: { public_id: "avatar_amazon", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.7 },
        price: 1199,
        discount_price: 1099,
        rating: 5,
        total_sell: 280,
        stock: 14,
    },
    {
        id: 7,
        bestDeal: false,
        featured: true,
        event: false,
        category: "Mobile and Tablets",
        name: "Samsung Galaxy S23 Ultra - 512GB, Phantom Black",
        description: [
            "Includes an integrated responsive S-Pen stylus",
            "Industry-leading 200MP camera resolution sensor",
            "Incredible Nightography dark light capture software features",
            "Driven by the ultimate Snapdragon custom processor architecture",
            "Massive 512GB storage capacity in Phantom Black"
        ],
        image_Url: [{ public_id: "s23_ultra", url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Samsung Hub", shop_avatar: { public_id: "avatar_sam", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.8 },
        price: 1379,
        discount_price: 1249,
        rating: 5,
        total_sell: 195,
        stock: 18,
    },
    {
        id: 8,
        bestDeal: true,
        featured: false,
        event: true,
        category: "Mobile and Tablets",
        name: "Apple iPad Air (5th Gen) - Wi-Fi, 64GB, Space Gray",
        description: [
            "Turbocharged by the desktop-class Apple M1 chip",
            "Supports Apple Pencil 2 and Magic Keyboard extensions",
            "Converts easily into a digital design mobile workstation",
            "Reliable Wi-Fi configurations",
            "64GB of storage inside an ultra-slim chassis layout"
        ],
        image_Url: [{ public_id: "ipad_air", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Apple Official", shop_avatar: { public_id: "avatar_apple", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" }, ratings: 4.9 },
        price: 599,
        discount_price: 549,
        rating: 4.5,
        total_sell: 110,
        stock: 22,
    },
    {
        id: 9,
        bestDeal: false,
        featured: false,
        event: false,
        category: "Mobile and Tablets",
        name: "Google Pixel 7 Pro - 128GB, Hazel",
        description: [
            "Google's smartest mobile processing design yet",
            "Driven directly by the custom Tensor G2 system chip",
            "Unlocks top-tier computational photography elements instantly",
            "128GB local storage",
            "Elegant and distinct Hazel color scheme"
        ],
        image_Url: [{ public_id: "pixel_7", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Google Store", shop_avatar: { public_id: "avatar_google", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 899,
        discount_price: 749,
        rating: 4,
        total_sell: 85,
        stock: 9,
    },
    {
        id: 10,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Mobile and Tablets",
        name: "OnePlus 11 5G - 256GB, Titan Black",
        description: [
            "Blazing fast 5G data computing architecture",
            "Paired with a signature Hasselblad Ambient Camera module",
            "Industry-defining 100W wired smart battery super charging",
            "256GB internal space limits",
            "Titan Black textured modern back shell"
        ],
        image_Url: [{ public_id: "oneplus_11", url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Amazon Ltd", shop_avatar: { public_id: "avatar_amazon", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.7 },
        price: 799,
        discount_price: 699,
        rating: 4.5,
        total_sell: 64,
        stock: 15,
    },

    // ==========================================
    // --- MUSIC & GAMING (5 Products) ---
    // ==========================================
    {
        id: 11,
        bestDeal: false,
        featured: true,
        event: false,
        category: "Music and Gaming",
        name: "ASUS ROG Delta S Gaming Headset - RGB, Hi-Res Audio",
        description: [
            "Equipped with industry-leading hi-fi grade ESS 9281 Quad DAC processors",
            "Integrated crystal clear AI Noise-Canceling Microphone arrays",
            "Pristine, immersive sound profiles for gaming communication",
            "Customizable, rich RGB lighting elements",
            "Ergonomic lightweight D-shaped ear cushions"
        ],
        image_Url: [{ public_id: "gaming_headphone_1", url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Asus Official", shop_avatar: { public_id: "avatar_asus", url: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 200,
        discount_price: 169,
        rating: 4.5,
        total_sell: 120,
        stock: 40,
    },
    {
        id: 12,
        bestDeal: true,
        featured: true,
        event: false,
        category: "Music and Gaming",
        name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        description: [
            "Industry-leading premium active noise cancellation",
            "Engineered with two internal core processors and eight microphone tracks",
            "Stunning high-resolution audio fidelity outputs",
            "Ultra-comfortable lightweight leather fit configuration",
            "Long-lasting wireless structural battery systems"
        ],
        image_Url: [{ public_id: "sony_xm5", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Sony Store", shop_avatar: { public_id: "avatar_sony", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.8 },
        price: 399,
        discount_price: 348,
        rating: 5,
        total_sell: 530,
        stock: 16,
    },
    {
        id: 13,
        bestDeal: false,
        featured: false,
        event: true,
        category: "Music and Gaming",
        name: "Sony PlayStation 5 Console (Slim Digital Edition)",
        description: [
            "Experience lightning-fast structural processing speeds",
            "Ultra-high-speed custom SSD drive partitions",
            "Deeper gameplay immersion via integrated haptic controller feedback",
            "Supports high frame rate smooth next-gen gaming configurations",
            "Sleek and compact space-saving Slim design layout"
        ],
        image_Url: [{ public_id: "ps5_console", url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "GameStop Central", shop_avatar: { public_id: "avatar_gs", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.6 },
        price: 449,
        discount_price: 399,
        rating: 5,
        total_sell: 410,
        stock: 5,
    },
    {
        id: 14,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Music and Gaming",
        name: "Nintendo Switch OLED Model - Neon Blue/Neon Red",
        description: [
            "Features a highly vibrant 7-inch rich OLED screen hardware display",
            "Wide adjustable system tabletop storage kickstand structure",
            "Upgraded dock housing featuring a new wired LAN dock port",
            "64GB of built-in expandable internal system storage",
            "Iconic Neon Blue and Neon Red modular controller aesthetic"
        ],
        image_Url: [{ public_id: "nintendo_switch", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "GameStop Central", shop_avatar: { public_id: "avatar_gs", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.6 },
        price: 349,
        discount_price: 319,
        rating: 4.5,
        total_sell: 340,
        stock: 20,
    },
    {
        id: 15,
        bestDeal: false,
        featured: false,
        event: false,
        category: "Music and Gaming",
        name: "Logitech G502 X Plus Wireless Gaming Mouse",
        description: [
            "Iconic operational ergonomic gaming structural layout",
            "Modern breakthrough mechanical-optical hybrid switches",
            "LIGHTSPEED enterprise-grade premium wireless protocol connection",
            "Clean dynamic RGB surface illumination zones",
            "Ultra-precise tracking sensor adjustments"
        ],
        image_Url: [{ public_id: "logitech_g502", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "PC Zone", shop_avatar: { public_id: "avatar_pczone", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.6 },
        price: 159,
        discount_price: 139,
        rating: 4.5,
        total_sell: 180,
        stock: 25,
    },

    // ==========================================
    // --- SHOES (5 Products) ---
    // ==========================================
    {
        id: 16,
        bestDeal: true,
        featured: true,
        event: false,
        category: "Shoes",
        name: "Nike Air Max 270 Lifestyle Sneakers - White/Red",
        description: [
            "Nike's first dedicated lifestyle Air Max fashion shoe",
            "Delivers striking sport style, cushioning, and bold attitude",
            "Features a prominent wrap-around visible air unit heel window",
            "Comfortable, breathable upper fabrics",
            "White base accented with aggressive red layouts"
        ],
        image_Url: [{ public_id: "nike_air_max", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Alisha Shoes Mart", shop_avatar: { public_id: "avatar_alisha", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.3 },
        price: 160,
        discount_price: 129,
        rating: 5,
        total_sell: 245,
        stock: 12,
    },
    {
        id: 17,
        bestDeal: false,
        featured: true,
        event: false,
        category: "Shoes",
        name: "Adidas Ultraboost Light Running Shoes - Core Black",
        description: [
            "Experience epic responsive kinetic energy feedback systems",
            "Newest generation of ultra-lightweight Boost cushioning material configurations",
            "Crafted carefully alongside breathable snug Primeknit woven structures",
            "Durable multi-surface traction outsoles",
            "Sleek Core Black styling"
        ],
        image_Url: [{ public_id: "adidas_ultra", url: "https://images.unsplash.com/photo-1587563871167-1ee9c131fadc?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Foot Locker Store", shop_avatar: { public_id: "avatar_foot", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 190,
        discount_price: 159,
        rating: 4.5,
        total_sell: 190,
        stock: 15,
    },
    {
        id: 18,
        bestDeal: true,
        featured: false,
        event: true,
        category: "Shoes",
        name: "Jordan 1 Retro High OG - Chicago Colorway",
        description: [
            "The iconic high-top basketball sneaker architecture that started it all",
            "Premium classic split-grain soft leather layers",
            "Matched perfectly alongside historic high-top ankle protection systems",
            "Timeless streetwear cultural fashion statement",
            "Authentic retro Chicago color configuration layout"
        ],
        image_Url: [{ public_id: "jordan_1", url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Alisha Shoes Mart", shop_avatar: { public_id: "avatar_alisha", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.3 },
        price: 180,
        discount_price: 165,
        rating: 5,
        total_sell: 88,
        stock: 4,
    },
    {
        id: 19,
        bestDeal: false,
        featured: false,
        event: false,
        category: "Shoes",
        name: "Puma Cali Women's Classic Leather Sneakers",
        description: [
            "An edgy urban street-style modification of vintage sneakers",
            "Nostalgic casual coastal lifestyle design profile",
            "Features durable solid leather upper construction wraps",
            "Combined elegantly with chunky progressive modern midsoles",
            "Excellent support and daily lifestyle flexibility"
        ],
        image_Url: [{ public_id: "puma_cali", url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Foot Locker Store", shop_avatar: { public_id: "avatar_foot", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 90,
        discount_price: 74,
        rating: 4,
        total_sell: 150,
        stock: 22,
    },
    {
        id: 20,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Shoes",
        name: "New Balance 574 Waterproof Trail Trainers",
        description: [
            "Rugged builds engineered to hold up securely against outdoor trail terrains",
            "Technical water-resistant protective mesh fabrics surface layering",
            "Classic reliable multi-surface high rubber traction tread patterns",
            "Shock-absorbing midsole base wall structures",
            "Balanced comfort and outdoor endurance limits"
        ],
        image_Url: [{ public_id: "nb_574", url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Sporty Shoes", shop_avatar: { public_id: "avatar_sporty", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.2 },
        price: 110,
        discount_price: 89,
        rating: 4.5,
        total_sell: 115,
        stock: 17,
    },

    // ==========================================
    // --- ACCESSORIES (5 Products) ---
    // ==========================================
    {
        id: 21,
        bestDeal: true,
        featured: true,
        event: false,
        category: "Accessories",
        name: "Minimalist Analog Leather Watch for Men - White Dial",
        description: [
            "Clean aesthetic profile layout options",
            "Genuine brown leather adjustable wrist band straps",
            "High-accuracy Japanese quartz internal movement mechanisms",
            "Polished durable stainless steel protective enclosure housing",
            "Sleek and clear minimalist white display face"
        ],
        image_Url: [{ public_id: "watch_classic", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Shahriar Watch House", shop_avatar: { public_id: "avatar_watch", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.4 },
        price: 120,
        discount_price: 89,
        rating: 4,
        total_sell: 92,
        stock: 14,
    },
    {
        id: 22,
        bestDeal: false,
        featured: true,
        event: true,
        category: "Accessories",
        name: "Luxury Chronograph Gold Stainless Steel Watch",
        description: [
            "Premium heavy physical weight materials design configuration",
            "Dual operational precision time sub-dial registers",
            "Classic integrated tachymeter accent outer bezel scales",
            "Deep atmospheric water-resistant protection ratings",
            "Stunning gold-tone plating finish for elegant statement wear"
        ],
        image_Url: [{ public_id: "watch_gold", url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Shahriar Watch House", shop_avatar: { public_id: "avatar_watch", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80" }, ratings: 4.4 },
        price: 250,
        discount_price: 199,
        rating: 4.5,
        total_sell: 62,
        stock: 8,
    },
    {
        id: 23,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Accessories",
        name: "Ray-Ban Classic Wayfarer Sunglasses - Matte Black",
        description: [
            "The most universally recognizable style frame cut in sunglass history",
            "Crystal clear protective structural lenses",
            "100% full UV hazard eye safety coatings",
            "High-strength molded structural acetate frames",
            "Clean modern Matte Black presentation styling"
        ],
        image_Url: [{ public_id: "rayban_wayfarer", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Boutique Shades", shop_avatar: { public_id: "avatar_boutique", url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80" }, ratings: 4.6 },
        price: 163,
        discount_price: 145,
        rating: 5,
        total_sell: 130,
        stock: 11,
    },
    {
        id: 24,
        bestDeal: false,
        featured: false,
        event: false,
        category: "Accessories",
        name: "Premium RFID Blocking Leather Bifold Wallet - Tan",
        description: [
            "Handcrafted entirely from authentic top-grain durable leather skins",
            "Built-in protective internal shielding grid technologies",
            "Safely blocks illicit wireless data scanning systems from bank cards",
            "Compact bifold organization structure cuts",
            "Warm and natural tan finish style profiles"
        ],
        image_Url: [{ public_id: "leather_wallet", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Elite Leather Co", shop_avatar: { public_id: "avatar_elite", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 65,
        discount_price: 49,
        rating: 4,
        total_sell: 210,
        stock: 45,
    },
    {
        id: 25,
        bestDeal: true,
        featured: false,
        event: false,
        category: "Accessories",
        name: "Urban Waterproof Canvas Everyday Backpack - Charcoal",
        description: [
            "Engineered to excel in urban multi-modal transit and commuting layouts",
            "Dedicated interior thick padded laptop security sleeve slots",
            "Organized quick-access zippered boundary spacing for travel utilities",
            "Waterproof high-density canvas cloth fabrics construction",
            "Neutral Charcoal gray tone styling layers"
        ],
        image_Url: [{ public_id: "backpack_urban", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" }],
        shop: { name: "Elite Leather Co", shop_avatar: { public_id: "avatar_elite", url: "https://images.unsplash.com/photo-1537498424460-1ea4844c3a47?w=150&auto=format&fit=crop&q=80" }, ratings: 4.5 },
        price: 85,
        discount_price: 69,
        rating: 4.5,
        total_sell: 175,
        stock: 20,
    },
];