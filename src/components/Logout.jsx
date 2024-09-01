import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Logout = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		Cookies.remove("authToken");
		sessionStorage.clear();
		localStorage.clear();
		toast.success("Logout successful!");
		navigate("/login");
	};

	return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
