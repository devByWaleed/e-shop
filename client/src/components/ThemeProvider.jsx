import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
    const { theme } = useSelector((state) => state.theme)
    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="min-h-screen bg-light-bg text-text dark:bg-dark dark:text-white transition-colors duration-300">
                {children}
            </div>
        </div>
    )
}

export default ThemeProvider
