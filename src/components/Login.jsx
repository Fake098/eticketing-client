import React, { useState } from "react";
import API from "../api/api";

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
			localStorage.setItem("authToken", data.token);
			// Redirect or perform further actions
		} catch (err) {
			setError(err.response.data.message);
		}
	};

	return (
		<div className="container mx-auto p-6">
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
