import { useState } from "react";
import { assets } from '../assets/assets.js'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {

        try {
            e.preventDefault();
            const { data } = await axios.post('/api/user/login', {
                email, password
            })

            if (data.success) {
                toast.success(data.message)
                navigate("/")
                // setUser(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-black ">
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    Login to your account
                </p>

                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <div className="relative mt-1">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 pr-10 outline-primary"
                            type={showPassword ? "text" : "password"}
                            required
                        />
                        <img
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                            src={showPassword ? assets.hide_password : assets.show_password}
                        />

                    </div>
                </div>

                {/* Forgot Password Link (Only for Login) */}

                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex items-center">
                        <input type="checkbox" id="remember-me" name="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <p className="text-sm text-right text-primary hover:text-primary-dull cursor-pointer font-medium transition-colors">
                        Forgot password?
                    </p>
                </div>

                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    Login
                </button>


                <p>
                    Don't have an account? <span onClick={() => navigate('/sign-up')} className="text-primary cursor-pointer">Click here</span>
                </p>
            </form>
        </section>
    );
};

export default Login
