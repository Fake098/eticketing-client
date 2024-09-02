import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const [countdown, setCountdown] = useState(0);
	const [toastId, setToastId] = useState(null); // To store toast ID for updating
	const navigate = useNavigate();

	useEffect(() => {
		let timer;
		if (countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prevCountdown) => {
					const newCountdown = prevCountdown - 1;
					if (toastId) {
						toast.update(toastId, {
							render: `Registration successful! Redirecting to login in ${newCountdown} seconds...`,
						});
					}
					return newCountdown;
				});
			}, 1000);
		} else if (countdown === 0 && toastId) {
			clearInterval(timer);
			navigate("/login");
		}
		return () => clearInterval(timer);
	}, [countdown, navigate, toastId]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await API.post("/v1/auth/register/user", formData);
			console.log(data);
			if (data.success) {
				const id = toast.success(
					`Registration successful! Redirecting to login in ${countdown} seconds...`
				);
				setToastId(id); // Store the toast ID for updating
				setCountdown(5); // Start countdown
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError(err.response.data.message);
		}
	};

	return (
		<div className="  mx-auto p-6">
			<h2 className="text-3xl font-bold mb-6">Register</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					name="username"
					value={formData.name}
					onChange={handleChange}
					placeholder="Name"
					className="w-full p-2 border border-gray-300 rounded"
				/>
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
					Register
				</button>
				{error && <p className="text-red-600">{error}</p>}
			</form>
		</div>
	);
};

export default Register;
