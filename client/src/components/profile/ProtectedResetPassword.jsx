import { useState, useRef, useContext } from "react"
import { assets } from "../../assets/assets"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import axios from "axios"


const ProtectedResetPassword = () => {
	const [email, setEmail] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [isEmailSend, setIsEmailSend] = useState(false)
	const OTPRef = useRef("")
	const [isOTPSubmitted, setIsOTPsubmited] = useState(false)
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const inputRefs = useRef([])


	const handleInput = (e, index) => {
		if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
			inputRefs.current[index + 1].focus()
		}
	}


	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && e.target.value === "" && index > 0) {
			inputRefs.current[index - 1].focus()
		}
	}

	const handlePaste = (e) => {
		const paste = e.clipboardData.getData("text")
		const pasteArray = paste.split("")
		pasteArray.forEach((char, index) => {
			inputRefs.current[index].value = char
		})
	}


	const onSubmitEmail = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post("/api/user/send-reset-otp", { email })

			data.success ? toast.success(data.message) : toast.error(data.message)
			data.success && setIsEmailSend(true)
			setIsEmailSend(true)

		} catch (error) {
			toast.error(error.message)
		}
	}

	const onSubmitOTP = async (e) => {
		e.preventDefault();
		try {

			const otpArray = inputRefs.current.map(e => e.value)
			const otpString = otpArray.join("")

			if (otpString.length < 6) {
				return toast.error("Please enter the full 6-digit OTP");
			}

			// Actually verify with the server — don't just trust the client
			const { data } = await axios.post("/api/user/verify-reset-otp", {
				email,
				otp: otpString
			});

			if (data.success) {
				OTPRef.current = otpString;
				setIsOTPsubmited(true);
				toast.success("OTP verified successfully");
			} else {
				// Clear the OTP inputs so user can retry
				inputRefs.current.forEach(input => input.value = "");
				inputRefs.current[0].focus();
				toast.error(data.message);
			}

		} catch (error) {
			toast.error(error.message)
		}
	}

	const onSubmitNewPassword = async (e) => {
		e.preventDefault();
		try {

			const { data } = await axios.post("/api/user/reset-password", { email, newPassword })

			if (data.success) {
				toast.success(data.message);
				navigate("/user-profile");
				setShowUserLogin(true);
			} else {
				toast.error(data.message);
			}

		} catch (error) {
			toast.error(error.message)
		}
	}


	return (
		<section className="flex flex-col items-center gap-6 text-center min-h-screen justify-center px-4">
			{/* 
				*************************************
				Email for resetting
				*************************************
			*/}
			{!isEmailSend &&
				<div className="flex flex-col items-center gap-6 text-center min-h-screen justify-center px-4">
					{/* Reset Password Card */}
					<div className="rounded-3xl p-8 sm:p-12 bg-white shadow-2xl border border-gray-100 w-full max-w-105">
						<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight mb-2">
							Reset Password
						</h2>

						<p className="mb-8 text-sm text-gray-500 sm:text-base">
							Enter your email address to receive a password reset link
						</p>

						<form className="space-y-4" onSubmit={onSubmitEmail}>
							{/* Email Field */}
							<div className="relative group">
								<input
									type="email"
									placeholder="Email Address"
									className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
									onChange={(e) => setEmail(e.target.value)}
									value={email}
									required
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full py-3.5 mt-4 font-semibold text-white rounded-xl shadow-lg bg-primary hover:bg-primary-dull transform transition-all active:scale-[0.97]"
							>
								Send Reset Link
							</button>
						</form>
					</div>
				</div>
			}



			{/* 
				*************************************
				OTP Input Form
				*************************************
			*/}
			{!isOTPSubmitted && isEmailSend &&
				<div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center">
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
							Reset Password OTP
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							Enter the 6-digit code sent to your email address.
						</p>
					</div>

					<form className="space-y-6" onSubmit={onSubmitOTP}>
						<div className="flex justify-between gap-2 sm:gap-4" onPaste={handlePaste}>
							{[...Array(6)].map((_, index) => (
								<input
									key={index}
									type="text"
									maxLength="1"
									className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
									ref={e => inputRefs.current[index] = e}
									onInput={(e) => handleInput(e, index)}
									onKeyDown={(e) => handleKeyDown(e, index)}
									required
								/>
							))}
						</div>

						<button
							type="submit"
							className="w-full py-3.5 font-semibold text-white rounded-xl shadow-lg bg-primary hover:bg-primary-dull transform transition-all active:scale-[0.98]"
						>
							Submit
						</button>
					</form>
				</div>
			}



			{/* 
				*************************************
				Password for resetting 
				*************************************
			*/}
			{isOTPSubmitted && isEmailSend &&
				<div className="rounded-3xl p-8 sm:p-12 bg-white shadow-2xl border border-gray-100 w-full max-w-105">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight mb-2">
						New Password
					</h2>

					<p className="mb-8 text-sm text-gray-500 sm:text-base">
						Enter your new password
					</p>

					<form className="space-y-4" onSubmit={onSubmitNewPassword}>
						{/* Password Field */}
						<div className="w-full text-left">
							<p className="text-sm font-medium text-gray-700 mb-1">New Password</p>
							<div className="relative mt-1">
								<input
									onChange={(e) => setNewPassword(e.target.value)}
									value={newPassword}
									placeholder="Enter your new password"
									className="border border-gray-200 rounded-xl w-full p-3 pr-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
									type={showPassword ? "text" : "password"}
									required
								/>
								<img
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
									src={showPassword ? assets.hide_password : assets.show_password}
									alt="toggle password visibility"
								/>
							</div>
						</div>


						{/* Submit Button */}
						<button
							type="submit"
							className="w-full py-3.5 mt-4 font-semibold text-white rounded-xl shadow-lg bg-primary hover:bg-primary-dull transform transition-all active:scale-[0.97]"
						>
							Reset Password
						</button>
					</form>
				</div>
			}


		</section>
	)
}

export default ProtectedResetPassword