import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
	if (localStorage.getItem("authToken")) {
		req.headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`;
	}
	return req;
});

export default API;
