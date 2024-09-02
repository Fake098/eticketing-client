import { xorEncryptDecrypt } from "./xorEncryption";

// Function to save tickets in localStorage with encryption
export const saveTicketsToLocalStorage = (tickets) => {
	const encryptedTickets = xorEncryptDecrypt(
		JSON.stringify(tickets),
		import.meta.env.VITE_XOR_KEY // Accessing the updated variable name
	);
	localStorage.setItem("tickets", encryptedTickets);
};

// Function to retrieve and decrypt tickets from localStorage
export const getTicketsFromLocalStorage = () => {
	const encryptedTickets = localStorage.getItem("tickets");
	if (!encryptedTickets) return [];
	const decryptedTickets = xorEncryptDecrypt(
		encryptedTickets,
		import.meta.env.VITE_XOR_KEY // Accessing the updated variable name
	);
	return decryptedTickets;
};

export const saveUserDataToSessionStorage = (user) => {
	const encryptedUser = xorEncryptDecrypt(
		JSON.stringify(user),
		import.meta.env.VITE_XOR_KEY // Accessing the updated variable name
	);
	sessionStorage.setItem("user", encryptedUser);
};

export const getUserDataFromSessionStorage = () => {
	const encryptedUser = sessionStorage.getItem("user");
	if (!encryptedUser) return null; // Return null if no data is found

	try {
		const decryptedUser = xorEncryptDecrypt(
			encryptedUser,
			import.meta.env.VITE_XOR_KEY // Accessing the updated environment variable name
		);
		return JSON.parse(decryptedUser);
	} catch (error) {
		console.error("Failed to decrypt or parse user data:", error);
		return null; // Return null in case of an error
	}
};
