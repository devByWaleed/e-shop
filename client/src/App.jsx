import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import axios from "axios";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Activation from './pages/Activation'
import Home from './pages/Home'
import store from './redux/store'
import { loadUser } from './redux/actions/userAction'
import ProtectedLayout from './components/ProtectedLayout';
import Loading from './components/Loading'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Events from './pages/Events';
import Faqs from './pages/Faqs';
import ProductDetails from './pages/ProductDetails';
import SellerSignup from './pages/seller/SellerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Profile from './pages/Profile';


// Send cookies
axios.defaults.withCredentials = true

// Backend URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
// axios.defaults.baseURL = process.env.BACKEND_URL


const App = () => {
  const hideNavFooterPages = [
    '/user-login',
    '/user-signup',
    '/seller-login',
    '/seller-signup'
  ]

  const shouldHideNavFooter = hideNavFooterPages.includes(useLocation().pathname);


  const { isLoading } = useSelector((state) => state.loading)
  const { isAuthenticated, user, loading: userLoading } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  // Load User
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  console.log("Auth Status:", isAuthenticated)
  console.log("User Data:", user)

  // Don't show main content while loading user data on app start
  if (userLoading && !user) {
    return <Loading />
  }


  return (
    <>
      <Toaster />
      {!shouldHideNavFooter && <Navbar />}

      <Routes>
        {/* Public Rotes */}
        <Route path='/loader' element={<Loading />} />
        <Route path='/' element={<Home />} />
        <Route path='/user-login' element={<Login />} />
        <Route path='/user-signup' element={<SignUp />} />
        <Route path='/activation/:activation_token' element={<Activation />} />
        <Route path='/events' element={<Events />} />
        {/* <Route path='/best-selling' element={<Events />} /> */}
        <Route path='/faqs' element={<Faqs />} />
        <Route path='/product-detail' element={<ProductDetails />} />

        {/* Seller Auth Routes */}
        <Route path='/seller-login' element={<SellerLogin />} />
        <Route path='/seller-signup' element={<SellerSignup />} />

        {/* Hybrid Routes  User Protected Routes */}
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />

        {/* FULLY PROTECTED ROUTES - Must be logged in (using Outlet pattern) */}
        <Route element={<ProtectedLayout requireAuth={true} />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
      {!shouldHideNavFooter && <Footer />}
    </>
  )
}

export default App
