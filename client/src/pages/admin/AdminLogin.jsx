import { useState } from "react";
import { assets } from '../../assets/assets.js'
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import toast from "react-hot-toast";
// import { loadUser } from "../redux/actions/userAction.js";
import useLoading from "../../hooks/useLoading.js";
import { adminSignInFailure, adminSignInStart, adminSignInSuccess } from "../../redux/slices/adminSlice.js";
import { adminLogin } from "../../redux/actions/adminAction.js";


const AdminLogin = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { adminLoading } = useSelector((state) => state.admin);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const result = await dispatch(adminLogin(email, password));

        if (result.success) {
            toast.success("Login successful!");
            navigate("/admin-profile");
        } else {
            toast.error(result.message || "Login failed");
        }
    };


    return (
        <section className="my-10 flex items-center text-sm text-black ">
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <NavLink to="/" className="text-primary font-bold">← Homepage</NavLink>
                <p className="text-2xl font-medium m-auto">
                    Admin Account Login
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

                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    Login
                </button>
            </form>
        </section>
    );
};

export default AdminLogin
