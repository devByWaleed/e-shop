import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/Hero'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

const Home = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <ProductCard />
            <Footer />
        </>
    )
}

export default Home
