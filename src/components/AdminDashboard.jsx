import React, { useState, useEffect } from "react";
import API from "../api/api";

const AdminDashboard = () => {
	const [events, setEvents] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		venue: "",
		date: "",
		description: "",
		ticketsAvailable: "",
		ticketPrice: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editingEventId, setEditingEventId] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			const { data } = await API.get("/v1/events");
			setEvents(data);
		};
		fetchEvents();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				const { data } = await API.put(`/events/${editingEventId}`, formData);
				setEvents(
					events.map((event) => (event.id === editingEventId ? data : event))
				);
				setIsEditing(false);
				setEditingEventId(null);
			} else {
				const { data } = await API.post("/events", formData);
				setEvents([...events, data]);
			}
			setFormData({
				name: "",
				venue: "",
				date: "",
				description: "",
				ticketsAvailable: "",
				ticketPrice: "",
			});
		} catch (error) {
			console.error("Error saving event", error);
		}
	};

	const handleEdit = (event) => {
		setFormData({
			id: event.id,
			name: event.name,
			venue: event.venue,
			date: event.date.split("T")[0],
			description: event.description,
			ticketsAvailable: event.ticketsAvailable,
			ticketPrice: event.ticketPrice,
		});
		setIsEditing(true);
		setEditingEventId(event._id);
	};

	const handleDelete = async (id) => {
		try {
			await API.delete(`/events/${id}`);
			setEvents(events.filter((event) => event._id !== id));
		} catch (error) {
			console.error("Error deleting event", error);
		}
	};

	return (
		<div className="container mx-auto p-6 bg-gray-900 text-white">
			<h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

			<form onSubmit={handleSubmit} className="mb-6">
				<input
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Event Name"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				/>
				<input
					name="venue"
					value={formData.venue}
					onChange={handleChange}
					placeholder="Venue"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				/>
				<input
					name="date"
					value={formData.date}
					onChange={handleChange}
					placeholder="Date"
					type="date"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				/>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Description"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				></textarea>
				<input
					name="ticketsAvailable"
					value={formData.ticketsAvailable}
					onChange={handleChange}
					placeholder="Tickets Available"
					type="number"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				/>
				<input
					name="ticketPrice"
					value={formData.ticketPrice}
					onChange={handleChange}
					placeholder="Ticket Price"
					type="number"
					className="border p-2 mb-2 w-full bg-gray-800 text-white"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white py-2 px-4 rounded"
				>
					{isEditing ? "Update Event" : "Add Event"}
				</button>
			</form>

			<h2 className="text-2xl font-bold mb-4">Existing Events</h2>
			<ul>
				{events.map((event) => (
					<li key={event._id} className="mb-4">
						<div className="bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-xl font-bold">{event.name}</h3>
							<p>{event.description}</p>
							<p>Venue: {event.venue}</p>
							<p>Date: {new Date(event.date).toLocaleDateString()}</p>
							<p>Tickets Available: {event.ticketsAvailable}</p>
							<p>Ticket Price: ${event.ticketPrice}</p>
							<button
								onClick={() => handleEdit(event)}
								className="bg-yellow-600 text-white py-1 px-2 rounded mt-2 mr-2"
							>
								Edit
							</button>
							<button
								onClick={() => handleDelete(event._id)}
								className="bg-red-600 text-white py-1 px-2 rounded mt-2"
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AdminDashboard;
