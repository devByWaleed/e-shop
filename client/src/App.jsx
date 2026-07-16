import React, { useEffect } from 'react'
import { matchPath, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import axios from "axios";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Activation from './pages/Activation'
import SellerActivation from './pages/seller/SellerActivation'
import Home from './pages/Home'
import store from './redux/store'
import { loadUser } from './redux/actions/userAction'
import { loadSeller } from './redux/actions/sellerAction'
import ProtectedLayout from './components/ProtectedLayout';
import SellerProtectedLayout from './components/seller/SellerProtectedLayout';
import Loading from './components/Loading'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Events from './pages/Events';
import Faqs from './pages/Faqs';
import ProductDetails from './pages/ProductDetails';
import SellerSignup from './pages/seller/SellerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import BestDealsPage from './pages/BestDealsPage';
import AllProducts from './pages/AllProducts';
import Sidebar from './components/Sidebar';
import SellerProfile from './pages/seller/SellerProfile';
import Profile from './pages/Profile';
import SellerHomepage from './pages/seller/SellerHomepage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import EventDetails from './pages/EventDetails';
import SellerOrderDetails from './pages/seller/SellerOrderDetails';
import UserOrderDetails from './pages/UserOrderDetails';
import UserOrderTrack from './pages/UserOrderTrack';
import SellerChatPage from './pages/seller/SellerChatPage';
import UserChatPage from './pages/UserChatPage';
import ResetPassword from './components/profile/ProtectedResetPassword';


import AdminProtectedLayout from './components/admin/AdminProtectedLayout';
import AdminEvents from './pages/admin/AdminEvents';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProfile from './pages/admin/AdminProfile';
import AdminInbox from './pages/admin/AdminInbox';
import { loadAdmin } from './redux/actions/adminAction';
import AdminChatPage from './pages/admin/AdminChatPage';


const App = () => {
  const hideNavFooterPages = [
    '/user-login',
    '/user-signup',
    '/seller-login',
    '/seller-signup',
    '/seller-dashboard',
    '/seller-products',
    '/seller-profile',
    '/admin-login',
    '/shop/:id'
  ]

  const currentPath = useLocation().pathname;
  const shouldHideNavFooter = hideNavFooterPages.some(pattern =>
    matchPath(pattern, currentPath)
  );


  const { isLoading } = useSelector((state) => state.loading)
  const { isAuthenticated, user, loading: userLoading } = useSelector((state) => state.user)
  const { sellerAuthenticated, seller, sellerLoading } = useSelector((state) => state.seller)
  const { adminAuthenticated, admin, adminLoading } = useSelector((state) => state.admin)

  const dispatch = useDispatch()

  // Load User
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  console.log("Auth Status:", isAuthenticated)
  console.log("User Data:", user)

  // Load Seller
  useEffect(() => {
    dispatch(loadSeller())
  }, [dispatch])

  console.log("Auth Status:", sellerAuthenticated)
  console.log("Seller Data:", seller)


  // Load Admin
  useEffect(() => {
    dispatch(loadAdmin())
  }, [dispatch])

  console.log("Admin Auth Status:", adminAuthenticated)
  console.log("Admin Data:", admin)

  // Don't show main content while loading user data on app start
  if (userLoading && !user && currentPath !== '/success') {
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

        <Route path='/activation/:activation_token' element={<Activation />} />
        <Route path='/seller-activation/:activation_token' element={<SellerActivation />} />
        <Route path='/user-reset-password' element={<ResetPassword />} />
        <Route path='/seller-reset-password' element={<ResetPassword />} />

        <Route path="/best-deals" element={<BestDealsPage />} />
        <Route path='/products' element={<AllProducts />} />
        <Route path='/product-detail' element={<ProductDetails />} />
        <Route path='/products/:category/:id' element={<ProductDetails />} />
        <Route path='/events' element={<Events />} />
        <Route path='/event-detail' element={<EventDetails />} />
        <Route path='/events/:category/:id' element={<EventDetails />} />
        <Route path='/faqs' element={<Faqs />} />
        <Route path="/shop/:id" element={<SellerHomepage />} />


        {/* USER Forms Based on Authentication */}
        <Route element={isAuthenticated ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='/user-login' element={<Login />} />
          <Route path='/user-signup' element={<SignUp />} />
        </Route>


        {/* USER Protected Routes */}
        <Route element={<ProtectedLayout requireAuth={true} requiredRole="user" />}>
          <Route path='/user-profile' element={<Profile />} />
          <Route path="/user-order/:id" element={<UserOrderDetails />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/success' element={<OrderSuccess />} />
          <Route path='/track-order/:id' element={<UserOrderTrack />} />
          <Route path='/user-conversation/:id' element={<UserChatPage />} />
        </Route>


        {/* SELLER Forms Based on Authentication */}
        <Route element={sellerAuthenticated ? <Navigate to="/" replace /> : <Outlet />}>
          <Route path='/seller-login' element={<SellerLogin />} />
          <Route path='/seller-signup' element={<SellerSignup />} />
        </Route>


        {/* SELLER Protected Routes */}
        <Route element={<SellerProtectedLayout requireAuth={true} requiredRole="seller" />}>
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/order/:id" element={<SellerOrderDetails />} />
          <Route path='/conversation/:id' element={<SellerChatPage />} />
        </Route>


        {/* ADMIN Auth Route */}
        <Route element={adminAuthenticated ? <Navigate to="/admin-profile" replace /> : <Outlet />}>
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>


        {/* ADMIN Protected Routes */}
        <Route element={<AdminProtectedLayout requireAuth={true} requiredRole="admin" />}>
          <Route path='/admin-conversation/:id' element={<AdminChatPage />} />
          <Route path="/admin-profile" element={<AdminProfile />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="inbox" element={<AdminInbox />} />
          </Route>
        </Route>
      </Routes>
      {!shouldHideNavFooter && <Footer />}
    </>
  )
}

export default App