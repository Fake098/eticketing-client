import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
	getTicketsFromLocalStorage,
	saveTicketsToLocalStorage,
} from "../utils/storageFunctions";

const EventDetails = () => {
	const { id } = useParams(); // Event ID from the URL
	const [event, setEvent] = useState(null);
	const [tickets, setTickets] = useState([]); // State to hold the user's tickets
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [isPurchasing, setIsPurchasing] = useState(false); // Track the purchase state
	const [purchaseError, setPurchaseError] = useState(null); // Track any errors
	const isAuthenticated = !!Cookies.get("authToken");
	useEffect(() => {
		const fetchEventAndTickets = async () => {
			try {
				// Fetch event details
				const { data: eventData } = await API.get(`/events/${id}`);
				setEvent(eventData);

				if (isAuthenticated) {
					// Fetch user's tickets for this event
					const ticketData = getTicketsFromLocalStorage();
					const parsedTicket = JSON.parse(ticketData);
					// Filter tickets for the current event
					const userTickets = parsedTicket.filter(
						(ticket) => ticket.event._id === id
					);
					setTickets(userTickets);
				}
			} catch (error) {
				console.error("Error fetching event and tickets data:", error);
			}
		};
		fetchEventAndTickets();
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

	const handlePurchase = async () => {
		if (!isAuthenticated) {
			toast.error("Please log in to continue.");
			setSelectedSeats([]);
			return;
		}
		setIsPurchasing(true);
		setPurchaseError(null);

		try {
			const response = await API.post(`/tickets/purchase`, {
				eventId: id,
				selectedSeats,
			});

			// Update localStorage with the new tickets
			const existingTickets = getTicketsFromLocalStorage();
			const parsedTicket = JSON.parse(existingTickets);
			const updatedTickets = [...parsedTicket, ...response.data];
			saveTicketsToLocalStorage(updatedTickets);

			// Filter tickets for the current event
			const userTickets = updatedTickets.filter(
				(ticket) => ticket.event._id === id
			);
			setTickets(userTickets);

			// Update the event state to disable the purchased seats
			setEvent((prevEvent) => {
				const updatedSeats = prevEvent.seats.map((seat) =>
					selectedSeats.includes(seat.seatNumber)
						? { ...seat, isAvailable: false }
						: seat
				);

				return {
					...prevEvent,
					seats: updatedSeats,
					ticketsAvailable: prevEvent.ticketsAvailable - selectedSeats.length,
				};
			});

			toast.success("Purchase successful!");
			// Clear selected seats after successful purchase
			setSelectedSeats([]);
		} catch (error) {
			console.error("Error purchasing tickets:", error);
			setPurchaseError("Failed to complete the purchase. Please try again.");
			toast.error("Failed to complete the purchase. Please try again.");
		} finally {
			setIsPurchasing(false);
		}
	};

	const getSeatColor = (seat) => {
		if (!seat.isAvailable) return "bg-gray-400"; // Reserved
		return selectedSeats.includes(seat.seatNumber)
			? "bg-red-500"
			: "bg-green-500"; // Selected or Available
	};

	return (
		<div className="mx-auto py-6 px-6">
			{event && (
				<div className="p-2 text-white">
					<h1 className="text-3xl font-bold mb-4">{event.name}</h1>
					<p className="text-lg mb-2">
						Date: {new Date(event.date).toLocaleDateString()}
					</p>
					<p className="text-lg mb-2">Venue: {event.venue}</p>
					<p className="text-lg mb-2">
						Tickets Available: {event.ticketsAvailable}
					</p>

					{/* Display Purchased Tickets */}
					<h2 className="text-2xl font-bold mt-6">Your Tickets</h2>
					<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{tickets.length > 0 ? (
							tickets.map((ticket) => (
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
							))
						) : (
							<p>You have not purchased any tickets yet.</p>
						)}
					</div>

					{/* Display Seat Selection */}
					<div className="w-full overflow-x-scroll overflow-y-hidden mt-6">
						<div className="custom-grid overflow-x-scroll mx-auto">
							{event?.seats?.map((seat) => (
								<div
									key={seat.seatNumber}
									className={`text-[12px] h-[3rem] w-[3rem] p-1 flex items-center justify-center rounded cursor-pointer ${getSeatColor(
										seat
									)}`}
									onClick={() => handleSeatClick(seat)}
								>
									{seat.seatNumber}
								</div>
							))}
						</div>
					</div>
					{purchaseError && (
						<p className="text-red-500 mt-4">{purchaseError}</p>
					)}
					<button
						className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded ${
							isPurchasing || selectedSeats.length === 0
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						onClick={handlePurchase}
						disabled={isPurchasing || selectedSeats.length === 0}
					>
						{isPurchasing ? "Purchasing..." : "Purchase Ticket"}
					</button>
				</div>
			)}
		</div>
	);
};

export default EventDetails;
