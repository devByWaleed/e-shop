import React from 'react'
import HeroSection from '../components/Hero'
import BestDeals from '../components/BestDeals'
import FeaturedProduct from '../components/FeaturedProduct'
import EventSection from '../components/EventSection'

const Home = () => {
    return (
        <>
            <HeroSection />
            <BestDeals />
            <EventSection />
            <FeaturedProduct />
        </>
    )
}

export default Home
