import React from 'react'
import HeroSection from '../components/Hero'
import Footer from '../components/Footer'
import BestDeals from '../components/BestDeals'
import FeaturedProduct from '../components/FeaturedProduct'
import EventProduct from '../components/EventProduct'

const Home = () => {
    return (
        <>
            <HeroSection />
            <BestDeals />
            <EventProduct />
            <FeaturedProduct />
            <Footer />
        </>
    )
}

export default Home
