import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from "react-hot-toast";
import axios from 'axios'
import Home from './Home'
import { loadUser } from '../redux/actions/userAction';


const Activation = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const activationEmail = async () => {
            try {
                const { data } = await axios.post("/api/user/activation", {
                    activation_token
                });

                if (data.success) {
                    toast.success(data.message)
                    // Load user data immediately after login
                    await dispatch(loadUser());
                    navigate("/")
                } else {
                    toast.error(data.message)

                    // Redirect to signup if token expired
                    if (data.message.includes("expired")) {
                        navigate("/sign-up");
                    }
                }
            } catch (error) {
                setError(error.message)
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
        }

        if (activation_token) {
            activationEmail()
        }
    }, [activation_token, navigate])
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
