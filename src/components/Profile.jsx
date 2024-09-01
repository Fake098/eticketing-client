import React, { useEffect, useState } from "react";
import API from "../api/api";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: userData } = await API.get("/auth/me");
			setUser(userData);

			const { data: ticketData } = await API.get("/tickets");
			setTickets(ticketData);
		};

		fetchUserData();
	}, []);

	return (
		<div className="container mx-auto p-6">
			{user && (
				<>
					<h2 className="text-3xl font-bold mb-4">Welcome, {user.name}</h2>
					<p className="text-lg mb-8">Email: {user.email}</p>
				</>
			)}
			<h3 className="text-2xl font-semibold mb-4">Your Tickets</h3>
			<ul className="space-y-4">
				{tickets.length > 0 ? (
					tickets.map((ticket) => (
						<li
							key={ticket._id}
							className="p-4 bg-gray-100 rounded-lg shadow-md"
						>
							<h4 className="text-xl font-semibold">{ticket.eventName}</h4>
							<p>Venue: {ticket.venue}</p>
							<p>Date: {new Date(ticket.date).toLocaleDateString()}</p>
							<p>
								Ticket Code:{" "}
								<span className="font-mono bg-gray-200 px-2 py-1 rounded">
									{ticket.code}
								</span>
							</p>
						</li>
					))
				) : (
					<p>No tickets purchased yet.</p>
				)}
			</ul>
		</div>
	);
};

export default Profile;
