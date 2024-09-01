import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
	baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
	const token = Cookies.get("authToken"); // Retrieve token from cookies
	if (token) {
		req.headers.Authorization = `Bearer ${token}`;
	}
	return req;
});

export default API;
