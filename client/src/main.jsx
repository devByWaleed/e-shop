import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import store from './redux/store.js'
import { Provider } from 'react-redux'
// import ThemeProvider from './components/ThemeProvider.jsx'
import axios from "axios";

// Send cookies
axios.defaults.withCredentials = true

// Backend URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      {/* <ThemeProvider> */}
      <App />
      {/* </ThemeProvider> */}
    </Provider>
  </BrowserRouter>
)
