import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

const EventDetails = () => {
	const { id } = useParams();
	const [event, setEvent] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState([]);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const { data } = await API.get(`/events/${id}`);
				setEvent(data);
			} catch (error) {
				console.error("Error fetching event data:", error);
			}
		};
		fetchEvent();
	}, [id]);

	const handleSeatClick = (seat) => {
		if (seat.isAvailable) {
			setSelectedSeats((prevSelectedSeats) =>
				prevSelectedSeats.includes(seat.seatNumber)
					? prevSelectedSeats.filter((s) => s !== seat.seatNumber)
					: [...prevSelectedSeats, seat.seatNumber]
			);
		}
	};

	const getSeatColor = (seat) => {
		if (!seat.isAvailable) return "bg-gray-400"; // Reserved
		return selectedSeats.includes(seat.seatNumber)
			? "bg-red-500"
			: "bg-green-500"; // Selected or Available
	};

	return (
		<div className="container mx-auto p-6">
			{event && (
				<div className="bg-white p-6 rounded-lg shadow-md text-black">
					<h1 className="text-3xl font-bold mb-4">{event.name}</h1>
					<p className="text-lg mb-2">
						Date: {new Date(event.date).toLocaleDateString()}
					</p>
					<p className="text-lg mb-2">Venue: {event.venue}</p>
					<p className="text-lg mb-2">
						Tickets Available: {event.ticketsAvailable}
					</p>
					<div className="mt-6 grid grid-cols-10 gap-2">
						{event?.seats?.map((seat) => (
							<div
								key={seat.seatNumber}
								className={`w-12 h-12 flex items-center justify-center rounded cursor-pointer ${getSeatColor(
									seat
								)}`}
								onClick={() => handleSeatClick(seat)}
							>
								{seat.seatNumber}
							</div>
						))}
					</div>
					<button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
						Purchase Ticket
					</button>
				</div>
			)}
		</div>
	);
};

export default EventDetails;
