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
	const [seatCount, setSeatCount] = useState(0); // Number of seats to purchase
	const [isPurchasing, setIsPurchasing] = useState(false); // Track the purchase state
	const [purchaseError, setPurchaseError] = useState(null); // Track any errors
	const isAuthenticated = !!Cookies.get("authToken");

	useEffect(() => {
		const fetchEventAndTickets = async () => {
			try {
				// Fetch event details
				const { data: eventData } = await API.get(`/v1/event/${id}`);
				setEvent(eventData);

				if (isAuthenticated) {
					// Fetch user's tickets for this event
					const ticketData = getTicketsFromLocalStorage();
					const parsedTicket = JSON.parse(ticketData);
					console.log(parsedTicket);
					// Filter tickets for the current event
					const userTickets = parsedTicket.filter(
						(ticket) => ticket?.event?.id == id || ticket?.eventId == id
					);
					console.log(userTickets);
					setTickets(userTickets);
				}
			} catch (error) {
				console.error("Error fetching event and tickets data:", error);
			}
		};
		fetchEventAndTickets();
	}, [id, isAuthenticated]);

	const handlePurchase = async () => {
		if (!isAuthenticated) {
			toast.error("Please log in to continue.");
			setSeatCount(0);
			return;
		}

		if (seatCount <= 0) {
			toast.error("Please enter a valid number of seats.");
			return;
		}

		if (seatCount > event.ticketsAvailable) {
			toast.error("Not enough seats available.");
			return;
		}

		setIsPurchasing(true);
		setPurchaseError(null);

		try {
			const response = await API.post(`/v1/ticket/buy`, {
				eventId: id,
				quantity: seatCount, // Send the number of seats requested
			});

			// Update localStorage with the new tickets
			const existingTickets = getTicketsFromLocalStorage();
			const parsedTicket = existingTickets ? JSON.parse(existingTickets) : [];
			console.log(parsedTicket);
			// Validate the result is an array, fallback to empty array if not
			const ticketsArray = Array.isArray(parsedTicket) ? parsedTicket : [];
			const updatedTickets = [...ticketsArray, ...response.data.tickets];
			// Filter tickets for the current event
			saveTicketsToLocalStorage(updatedTickets);
			const userTickets = updatedTickets.filter(
				(ticket) => ticket?.event?.id == id || ticket?.eventId == id
			);
			setTickets(userTickets);

			// Update the event state to reflect the reduced number of available tickets
			setEvent((prevEvent) => ({
				...prevEvent,
				ticketsAvailable: prevEvent.ticketsAvailable - seatCount,
			}));

			toast.success("Purchase successful!");
			setSeatCount(0); // Clear the input after successful purchase
		} catch (error) {
			console.error("Error purchasing tickets:", error);
			setPurchaseError("Failed to complete the purchase. Please try again.");
			toast.error("Failed to complete the purchase. Please try again.");
		} finally {
			setIsPurchasing(false);
		}
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
						Tickets Available: {event.totalTickets - event.soldTicketCount}
					</p>

					{/* Display Purchased Tickets */}
					<h2 className="text-2xl font-bold mt-6">Your Tickets</h2>
					<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{tickets.length > 0 ? (
							tickets.map((ticket) => (
								<div
									key={ticket.id}
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

					{/* Input Field for Number of Seats */}
					<div className="mt-6">
						<label className="block text-lg mb-2">
							Enter the number of seats to purchase:
						</label>
						<input
							type="number"
							min="1"
							max={event.ticketsAvailable}
							value={seatCount}
							onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
							className="w-full px-3 py-2 border rounded"
						/>
					</div>

					{purchaseError && (
						<p className="text-red-500 mt-4">{purchaseError}</p>
					)}

					<button
						className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded ${
							isPurchasing || seatCount <= 0
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						onClick={handlePurchase}
						disabled={isPurchasing || seatCount <= 0}
					>
						{isPurchasing ? "Purchasing..." : "Purchase Tickets"}
					</button>
				</div>
			)}
		</div>
	);
};

export default EventDetails;
