import React, { useState } from "react";
import Cookies from "js-cookie";
import API from "../api/api";
import { toast } from "react-toastify";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await API.post("/auth/login", formData);
			if (data) {
				// Save token to cookies
				Cookies.set("authToken", data.token, { expires: 7 }); // Expires in 7 days

				// Save user data in sessionStorage
				sessionStorage.setItem(
					"user",
					JSON.stringify({
						_id: data._id,
						name: data.name,
						email: data.email,
					})
				);

				// Save tickets in localStorage
				localStorage.setItem("tickets", JSON.stringify(data.tickets));

				// Show success toast
				toast.success("Login successful! Redirecting to your profile...");

				// Redirect to profile page after a short delay to allow toast to be visible
				setTimeout(() => {
					window.location.href = "/profile";
				}, 2000);
			} else {
				throw new Error("Login failed. Please try again.");
			}
		} catch (err) {
			// Show error toast
			toast.error(
				err.response?.data?.message || "Login failed. Please try again."
			);
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		}
	};

	return (
		<div className="  mx-auto p-6">
			<h2 className="text-3xl font-bold mb-6">Login</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					placeholder="Password"
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white py-2 px-4 rounded"
				>
					Login
				</button>
				{error && <p className="text-red-600">{error}</p>}
			</form>
		</div>
	);
};

export default Login;
