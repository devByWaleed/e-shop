import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
// import toast from "react-hot-toast";
import Home from './Home'

const Activation = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(false)

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const { data } = await axios.post("http://localhost:4000/user/activation", activation_token)

                    if (data.success) {
                        console.log(data.message)
                    } else {
                        console.error(data.message)
                    }
                } catch (error) {
                    setError(error.message)
                    console.error(error.message)
                }
            }
        }
    }, [activation_token])
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            {
                error ? (
                    <p>Your token has expired</p>
                ) : (
                    <p>Your account has been created successfully!</p>
                )
            }
            <NavLink to='/'>
                <Home />
            </NavLink>
        </div>
    )
}

export default Activation
