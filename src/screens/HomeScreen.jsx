import EventList from "../components/EventList";

const HomeScreen = () => {
	return (
		<div className="  mx-auto p-6">
			<h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
			<EventList />
		</div>
	);
};

export default HomeScreen;
