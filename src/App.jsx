import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import EventScreen from "./screens/EventScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AdminDashboard from "./components/AdminDashboard"; // Import AdminDashboard
import AdminRoute from "./components/AdminRoute"; // Import AdminRoute
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/events/:id" element={<EventScreen />} />
				<Route
					path="/register"
					element={<PublicRoute element={<Register />} restricted={true} />}
				/>
				<Route
					path="/login"
					element={<PublicRoute element={<Login />} restricted={true} />}
				/>
				<Route
					path="/profile"
					element={<PrivateRoute element={<ProfileScreen />} />}
				/>
				{/* Admin Dashboard Route */}
				<Route
					path="/admin"
					element={<AdminRoute element={<AdminDashboard />} />}
				/>
			</Routes>
			{/* Toast Container */}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				draggable
				pauseOnFocusLoss
				theme="dark"
			/>
		</Router>
	);
}

export default App;
