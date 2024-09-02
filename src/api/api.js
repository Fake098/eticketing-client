import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
	baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((req) => {
	const token = Cookies.get("authToken"); // Retrieve token from cookies
	if (token) {
		// Send the token in the correct header as expected by the backend
		req.headers["x-access-token"] = token;
	}
	return req;
});

export default API;
