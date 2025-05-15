export const handleClient = (client: WebSocket) => {
	client.onopen = () => {
		// OPEN CONN
	};

	client.onclose = () => {
		// CLOSE CONN
	};

	client.onmessage = () => {
		// MESSAGE
	};

	client.onerror = () => {
		// ERR
	};
};
