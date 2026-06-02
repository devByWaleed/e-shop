import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/Hero'
import Footer from '../components/Footer'
import BestDeals from '../components/BestDeals'
import FeaturedProduct from '../components/FeaturedProduct'

const Home = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <BestDeals />
            <FeaturedProduct />
            <Footer />
        </>
    )
}

export default Home
