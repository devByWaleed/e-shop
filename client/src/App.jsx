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

// Send cookies
axios.defaults.withCredentials = true

// Backend URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
// axios.defaults.baseURL = process.env.BACKEND_URL

// Optional: Add an interceptor to see requests
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  console.log('With Credentials:', request.withCredentials);
  return request;
});


const App = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading } = useSelector((state) => state.user)

  // Load User
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  console.log("Auth Status:", isAuthenticated)
  console.log("User Data:", user)


  return (
    <div>
      <Toaster />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/activation/:activation_token' element={<Activation />} />
      </Routes>
    </div>
  )
}

export default App
