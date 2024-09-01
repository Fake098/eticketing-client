import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="bg-blue-600 w-full top-0 left-0 text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-2xl font-bold text-white">
					<Link to="/" className="text-white">
						E-Ticketing
					</Link>
				</h1>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<Link to="/" className="text-white hover:text-gray-200">
								Events
							</Link>
						</li>
						<li>
							<Link to="/profile" className="text-white hover:text-gray-200">
								Profile
							</Link>
						</li>
						<li>
							<Link to="/login" className="text-white hover:text-gray-200">
								Login
							</Link>
						</li>
						<li>
							<Link to="/register" className="text-white shover:text-gray-200">
								Register
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
