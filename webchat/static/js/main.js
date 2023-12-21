const ws = new WebSocket('ws://localhost:8000/ws/presence/');
const presenceEl = document.getElementById('pre_cnt');
const messagesEl = document.getElementById('messages');
const onlineUsers = document.querySelector("#online-users");
const chat = document.querySelector("#chat");
const messageInput = document.querySelector('input[name="message_input"]');
const sendMessageButton = document.querySelector('input[name="send_message_button"]');
let myForm = document.getElementById("myForm");
var inputImg = document.getElementById('myImageInput');

// Отправка на клиента сообщение закончено, добавить функцию показа сообщения


myForm.addEventListener("submit", function(event) {
	event.preventDefault();
	var username = document.getElementById("username").value;
	ws.send(JSON.stringify({
		"username": username,
		'type': 'update',
	}));
});


function base64ToBytes(base64) {
	var binaryString = atob(base64);
	var bytes = new Uint8Array(binaryString.length);
	for (var i = 0; i < binaryString.length; i++) {
	  bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
}

function handleImgMessage(data){
	// const blobURL = URL.createObjectURL(data);
	const img = document.createElement('img');
	img.src = data.img;
	chat.appendChild(img);
}

function handleTextMessage(data){
	data_json = JSON.parse(data);
	if (data_json.type === 'chat') {
		
		// const li3 = document.createElement("li");
		// li3.classList.add("on-us")
		// const messageFinal = data_json.username + data_json.message
		// li3.innerHTML = messageFinal;
		// chat.appendChild(li3);

		// handleImgMessage(data_json)
	
		const chat_entry = document.createElement('li')
 
		const username_elem = document.createElement('p')
		username_elem.innerHTML = data_json.username
		chat_entry.appendChild(username_elem)
		
		if(data_json.message !== null) {
			const message_elem  = document.createElement('p')
			message_elem.innerHTML = data_json.message
			chat_entry.appendChild(message_elem)
		}
		
		if(data_json.img !== null) {
			const img_elem = document.createElement('img')
			img_elem.src = data_json.img
			chat_entry.appendChild(img_elem)
		}
		
		chat.appendChild(chat_entry)



	} else if (data_json.type === 'update') {

		presenceEl.innerHTML = data_json.online;

		const li1 = document.createElement('li');
		li1.innerHTML = data_json.msg;
		messagesEl.appendChild(li1);
	  
		onlineUsers.innerHTML = "";
		data_json.users.forEach(user => {
		  const li2 = document.createElement("li");
		  li2.classList.add("on-us");
		  li2.innerHTML = user;
		  onlineUsers.appendChild(li2);
		})
	}
}



ws.onmessage = (event) => {

	if (event.data instanceof Blob) {
		handleBlobMessage(event.data)
	} else {
		handleTextMessage(event.data)
	};

};


sendMessageButton.onclick = () => {
	let message = messageInput.value
	let username = document.getElementById("username").value
	console.log(message)
	const fileInput = document.getElementById('myImage');

	if (fileInput.files.length > 0){
		//! Отправка картинок на сервер
		const file = fileInput.files[0];
	
		function sendFile(file) {
			var reader = new FileReader();
			reader.onload = function(event) {
				// var byteArray = new Uint8Array(event.target.result);
				// ws.send(byteArray.buffer);
				const base64Image = event.target.result;
				const json = {
					img: base64Image,
					'type': 'img',
				};
				const jsonString = JSON.stringify(json);
				ws.send(jsonString);
			};
			reader.readAsDataURL(file);
		}
		sendFile(file);

		if (messageInput.value.trim() !== ""){
			ws.send(JSON.stringify({
				// "user": username,
				"message": message,
				'type': 'message',
			}));
			messageInput.value = '';
		}

	} else {
		ws.send(JSON.stringify({
			// "user": username,
			"message": message,
			'type': 'message',
		}));
		messageInput.value = '';
	}


}
