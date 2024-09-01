import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ element, restricted }) => {
	const token = Cookies.get("authToken");

	return token && restricted ? <Navigate to="/profile" /> : element;
};

export default PublicRoute;
