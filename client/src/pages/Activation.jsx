import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from "react-hot-toast";
import axios from 'axios'
import { loadUser } from '../redux/actions/userAction';

// Lives outside the component so it survives StrictMode double runs and remounts
const submittedTokens = new Set()

const Activation = () => {
    const { activation_token } = useParams()
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!activation_token) return

        // Same token already sent: do not call the API again
        if (submittedTokens.has(activation_token)) return
        submittedTokens.add(activation_token)

        const activationEmail = async () => {
            try {
                const { data } = await axios.post(
                    "/api/user/activation",
                    { activation_token },
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success(data.message || "Account activated successfully")
                    // Load user data immediately after activation
                    await dispatch(loadUser());
                    navigate("/")
                } else {
                    setErrorMessage(data.message)
                    toast.error(data.message)

                    // Redirect to signup if token expired
                    if (data.message.includes("expired")) {
                        navigate("/sign-up");
                    }
                }
            } catch (error) {
                // Network failure: allow a retry on the next visit
                submittedTokens.delete(activation_token)
                setErrorMessage(error.message)
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
        }

        activationEmail()
    }, [activation_token, navigate, dispatch])

    return (
        <div className='w-full h-screen flex flex-col gap-4 justify-center items-center'>
            {loading ? (
                <p>Activating your account...</p>
            ) : errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                <p>Your account has been created successfully!</p>
            )}
            <NavLink to='/' className='text-primary'>
                Go to homepage
            </NavLink>
        </div>
    )
}

export default Activation