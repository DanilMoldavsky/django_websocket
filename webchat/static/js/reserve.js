document.addEventListener('DOMContentLoaded', function(){

	const messagesContainer = document.querySelector('#message_container');
	const messageInput = document.querySelector('input[name="message_input"]');
	const sendMessageButton = document.querySelector('input[name="send_message_button"]');

	const websocketClient = new WebSocket('ws://127.0.0.1:8000/ws');

	// websocketClient.onopen = function(e) {
	// 	websocketClient.send(JSON.stringify({
	// 	message: 'Hello from Js client!'
	// }));
	// };
	websocketClient.onopen = () => {
		sendMessageButton.onclick = () => {
			websocketClient.send(messageInput.value);
			messageInput.value = '';
		};
	};


	websocketClient.onmessage = function(event) {
	try {
		console.log(event);
	} catch (e) {
		console.log('Error:', e.message);
	}
	};
}, false);