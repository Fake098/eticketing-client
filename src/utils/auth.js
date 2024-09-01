import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * Decodes the JWT token stored in cookies and returns the user role.
 * @returns {string|null} User role or null if not authenticated.
 */
export const getUserRole = () => {
	const token = Cookies.get("authToken");
	if (!token) return null;

	try {
		const decoded = jwtDecode(token);
		return decoded.role || null; // Assumes the token has a 'role' field
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

/**
 * Checks if the user is authenticated.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
	return !!Cookies.get("authToken");
};
