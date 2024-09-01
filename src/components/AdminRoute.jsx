import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

/**
 * AdminRoute component to protect admin routes.
 * @param {object} props
 * @param {React.Component} props.element - The component to render if authorized.
 * @returns {React.Component}
 */
const AdminRoute = ({ element }) => {
	if (!isAuthenticated()) {
		// User is not authenticated
		return <Navigate to="/login" />;
	}

	const role = getUserRole();
	if (!role) {
		// User is authenticated but not an admin
		return <Navigate to="/" />;
	}

	// User is authenticated and is an admin
	return element;
};

export default AdminRoute;
