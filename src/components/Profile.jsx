import React, { useEffect, useState } from "react";
import Logout from "./Logout";

const Profile = () => {
	const [tickets, setTickets] = useState([]);
	const [user, setUser] = useState({ name: "", email: "" });

	useEffect(() => {
		const fetchUserData = () => {
			// Fetch tickets data from localStorage
			const ticketData = localStorage.getItem("tickets");
			setTickets(ticketData ? JSON.parse(ticketData) : []);

			const userData = sessionStorage.getItem("user");
			if (userData) {
				const parsedUser = JSON.parse(userData);
				setUser({ name: parsedUser.name, email: parsedUser.email });
			}
		};

		fetchUserData();
	}, []);

	// Group tickets by event name
	const groupedTickets =
		tickets && tickets.length > 0
			? tickets.reduce((acc, ticket) => {
					const eventName = ticket.event.name; // Assuming ticket.event contains event details
					if (!acc[eventName]) {
						acc[eventName] = [];
					}
					acc[eventName].push(ticket);
					return acc;
			  }, {})
			: {};

	return (
		<div className="mx-auto p-6">
			{user && (
				<h3 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h3>
			)}
			<h3 className="text-2xl font-semibold mb-4">Your Tickets</h3>
			{Object.keys(groupedTickets).length > 0 ? (
				Object.keys(groupedTickets).map((eventName) => (
					<div key={eventName} className="mb-8">
						<h4 className="text-xl font-bold mb-4">{eventName}</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							{groupedTickets[eventName].map((ticket) => (
								<div
									key={ticket._id}
									className="p-4 border border-gray-200 rounded-lg"
								>
									<p>Seat: {ticket.seatNumber}</p>
									<p>Ticket Code: {ticket.code}</p>
									<p>
										Purchased on:{" "}
										{new Date(ticket.createdAt).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					</div>
				))
			) : (
				<p>No tickets purchased yet.</p>
			)}
			<Logout />
		</div>
	);
};

export default Profile;
