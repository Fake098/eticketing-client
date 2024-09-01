import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

const EventList = () => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			const { data } = await API.get("/events");
			setEvents(data);
		};
		fetchEvents();
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			{events.map((event) => (
				<div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
					<h3 className="text-xl font-semibold">{event.name}</h3>
					<p className="text-gray-600">
						{new Date(event.date).toLocaleDateString()}
					</p>
					<p className="text-gray-600">Venue: {event.venue}</p>
					<Link
						to={`/events/${event._id}`}
						className="text-blue-600 hover:underline mt-4 block"
					>
						View Details
					</Link>
				</div>
			))}
		</div>
	);
};

export default EventList;
