import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import EventScreen from "./screens/EventScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/events/:id" element={<EventScreen />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/profile" element={<ProfileScreen />} />
			</Routes>
		</Router>
	);
}

export default App;
