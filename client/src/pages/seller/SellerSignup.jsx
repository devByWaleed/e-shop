import { useState } from "react";
import { assets } from '../../assets/assets.js'
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios"
import toast from "react-hot-toast";
import useLoading from "../../hooks/useLoading.js"


const SellerSignup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState(0);
    const [avatar, setAvatar] = useState(null);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const { withLoading } = useLoading();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        setAvatar(file)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const config = { headers: { "Content-Type": "multipart/form-data" } }

        const newForm = new FormData()
        newForm.append("file", avatar)
        newForm.append("name", name)
        newForm.append("email", email)
        newForm.append("password", password)
        newForm.append("zipCode", zipCode)
        newForm.append("address", address)
        newForm.append("phoneNumber", phoneNumber)

        await withLoading(
            async () => {
                const { data } = await axios.post("/api/seller/seller-register", newForm, config)

                if (data.success) {
                    toast.success(data.message);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setAvatar(null);
                    setPhoneNumber(0);
                    setAddress("");
                    setZipCode(0);
                } else {
                    toast.error(data.message);
                    throw new Error(data.message);
                }
            },
            { message: "Creating account..." }
        );
    }

    return (
        <section className="my-10 flex items-center text-sm text-black">
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <NavLink to="/" className="text-primary font-bold">← Homepage</NavLink>
                <p className="text-2xl font-medium m-auto">
                    Register As A Seller
                </p>

                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
                <div className="w-full ">
                    <p>Shop Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Shop Number</p>
                    <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="number" required />
                </div>
                <div className="w-full ">
                    <p>Shop Address</p>
                    <input onChange={(e) => setAddress(e.target.value)} value={address} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
                <div className="w-full ">
                    <p>Zip Code</p>
                    <input onChange={(e) => setZipCode(e.target.value)} value={zipCode} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="number" required />
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

                <div className="mt-2 flex items-center">
                    {/* <span className="inline-block h-8 w-8 rounded-full overflow-hidden"> */}
                    <img className="inline-block h-8 w-8 rounded-full overflow-hidden" src={avatar ? URL.createObjectURL(avatar) : assets.profile} alt="Profile Icon" />
                    {/* </span> */}
                    <label
                        htmlFor="file-input"
                        className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <span>Upload a file</span>
                        <input
                            type="file"
                            name="avatar"
                            id="file-input"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileInputChange}
                            className="sr-only"
                        />
                    </label>
                </div>


                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    Create Account
                </button>


                <p>
                    Already have an account? <span onClick={() => navigate('/seller-login')} className="text-primary cursor-pointer">Click here</span>
                </p>
            </form>
        </section>
    );
};

export default SellerSignup
