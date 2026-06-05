import React from 'react'
import HeroSection from '../components/Hero'
import BestDeals from '../components/BestDeals'
import FeaturedProduct from '../components/FeaturedProduct'
import EventProduct from '../components/EventProduct'
import { NavLink } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <HeroSection />
            <BestDeals />
            <EventProduct />
            <FeaturedProduct />
        </>
    )
}

export default Home
