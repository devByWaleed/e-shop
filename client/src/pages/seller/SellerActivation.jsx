import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from "react-hot-toast";
import axios from 'axios'
import useLoading from '../../hooks/useLoading';
// import { loadUser } from '../redux/actions/userAction';


const Activation = () => {
    const { activation_token } = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { withLoading } = useLoading();

    useEffect(() => {
        const activationEmail = async () => {
            // Wrap the network request inside withLoading
            await withLoading(async () => {
                try {
                    const { data } = await axios.post("/api/seller/seller-activation", {
                        activation_token
                    });

                    if (data.success) {
                        toast.success(data.message);
                        navigate("/seller-login");
                    } else {
                        toast.error(data.message);
                        if (data.message.includes("expired")) {
                            navigate("/seller-signup");
                        }
                    }
                } catch (error) {
                    setError(error.message);
                    toast.error(error.message);
                }
            }, { message: "Activating your seller account..." });
        };

        if (activation_token) {
            activationEmail();
        }
    }, [activation_token, navigate]);


    return (
        <div className='w-full h-screen flex justify-center items-center'>
            {
                error ? (
                    <p>Your token has expired</p>
                ) : (
                    <p>Your account has been created successfully!</p>
                )
            }
            <p onClick={() => navigate('/user-login')} className="text-primary underline">
                Click here to login
            </p>
        </div>
    )
}

export default Activation
