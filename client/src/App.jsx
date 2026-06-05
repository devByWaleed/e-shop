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
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Events from './pages/Events';
import Faqs from './pages/Faqs';

// Send cookies
axios.defaults.withCredentials = true

// Backend URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
// axios.defaults.baseURL = process.env.BACKEND_URL


const App = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.loading)
  const { isAuthenticated, user, loading: userLoading } = useSelector((state) => state.user)

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
    <div>
      <Toaster />
      <Navbar />

      <Routes>
        {/* Components */}
        <Route path='/loader' element={<Loading />} />

        {/* Pages */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/activation/:activation_token' element={<Activation />} />
        <Route path='/events' element={<Events />} />
        {/* <Route path='/best-selling' element={<Events />} /> */}
        <Route path='/faqs' element={<Faqs />} />

        {/* Protected Routes */}
        {/* <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } /> */}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
