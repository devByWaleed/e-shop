import { useState, useRef } from "react"
import { assets } from "../../assets/assets"
import { useNavigate, useLocation } from "react-router-dom"
import toast from 'react-hot-toast'
import axios from "axios"

const USER_API = {
	send: "/api/user/send-reset-otp",
	verify: "/api/user/verify-reset-otp",
	reset: "/api/user/reset-password",
	login: "/user-login",
}

const SELLER_API = {
	send: "/api/seller/seller-send-reset-otp",
	verify: "/api/seller/seller-verify-reset-otp",
	reset: "/api/seller/seller-reset-password",
	login: "/seller-login",
}

const ProtectedResetPassword = () => {
	const [form, setForm] = useState({ email: "", newPassword: "" })
	const [isEmailSend, setIsEmailSend] = useState(false)
	const [isOTPSubmitted, setIsOTPsubmited] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const navigate = useNavigate()
	const inputRefs = useRef([])

	// /seller-reset-password uses the seller endpoints, everything else uses the user ones
	const isSeller = useLocation().pathname.startsWith("/seller")
	const api = isSeller ? SELLER_API : USER_API

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

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
		e.preventDefault()
		const pasteArray = e.clipboardData.getData("text").trim().slice(0, 6).split("")
		pasteArray.forEach((char, index) => {
			if (inputRefs.current[index]) inputRefs.current[index].value = char
		})
		const last = Math.min(pasteArray.length, 6) - 1
		if (last >= 0) inputRefs.current[last].focus()
	}

	const onSubmitEmail = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(api.send, { email: form.email }, { withCredentials: true })

			if (data.success) {
				toast.success(data.message)
				setIsEmailSend(true)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message)
		}
	}

	const onSubmitOTP = async (e) => {
		e.preventDefault()
		try {
			const otpString = inputRefs.current.map((input) => input.value).join("")

			if (otpString.length < 6) {
				return toast.error("Please enter the full 6-digit OTP")
			}

			const { data } = await axios.post(
				api.verify,
				{ email: form.email, otp: otpString },
				{ withCredentials: true }
			)

			if (data.success) {
				setIsOTPsubmited(true)
				toast.success("OTP verified successfully")
			} else {
				inputRefs.current.forEach((input) => (input.value = ""))
				inputRefs.current[0].focus()
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message)
		}
	}

	const onSubmitNewPassword = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(
				api.reset,
				{ email: form.email, newPassword: form.newPassword },
				{ withCredentials: true }
			)

			if (data.success) {
				toast.success(data.message)
				navigate(api.login)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message)
		}
	}

	return (
		<section className="flex flex-col items-center gap-6 text-center min-h-screen justify-center px-4">
			{/* Email for resetting */}
			{!isEmailSend &&
				<div className="flex flex-col items-center gap-6 text-center min-h-screen justify-center px-4">
					<div className="rounded-3xl p-8 sm:p-12 bg-white shadow-2xl border border-gray-100 w-full max-w-105">
						<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight mb-2">
							Reset Password
						</h2>

						<p className="mb-8 text-sm text-gray-500 sm:text-base">
							Enter your email address to receive a password reset code
						</p>

						<form className="space-y-4" onSubmit={onSubmitEmail}>
							<div className="relative group">
								<input
									type="email"
									name="email"
									placeholder="Email Address"
									className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
									onChange={handleChange}
									value={form.email}
									required
								/>
							</div>

							<button
								type="submit"
								className="w-full py-3.5 mt-4 font-semibold text-white rounded-xl shadow-lg bg-primary hover:bg-primary-dull transform transition-all active:scale-[0.97]"
							>
								Send Reset Code
							</button>
						</form>
					</div>
				</div>
			}

			{/* OTP Input Form */}
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
									ref={(el) => (inputRefs.current[index] = el)}
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

			{/* Password for resetting */}
			{isOTPSubmitted && isEmailSend &&
				<div className="rounded-3xl p-8 sm:p-12 bg-white shadow-2xl border border-gray-100 w-full max-w-105">
					<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight mb-2">
						New Password
					</h2>

					<p className="mb-8 text-sm text-gray-500 sm:text-base">
						Enter your new password
					</p>

					<form className="space-y-4" onSubmit={onSubmitNewPassword}>
						<div className="w-full text-left">
							<p className="text-sm font-medium text-gray-700 mb-1">New Password</p>
							<div className="relative mt-1">
								<input
									name="newPassword"
									onChange={handleChange}
									value={form.newPassword}
									placeholder="Enter your new password"
									className="border border-gray-200 rounded-xl w-full p-3 pr-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
									type={showPassword ? "text" : "password"}
									minLength={8}
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