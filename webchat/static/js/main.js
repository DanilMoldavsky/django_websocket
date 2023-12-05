const ws = new WebSocket('ws://localhost:8000/ws/presence/');
const presenceEl = document.getElementById('pre_cnt');
const messagesEl = document.getElementById('messages');
const onlineUsers = document.querySelector("#online-users");
const chat = document.querySelector("#chat");
const messageInput = document.querySelector('input[name="message_input"]');
const sendMessageButton = document.querySelector('input[name="send_message_button"]');
let myForm = document.getElementById("myForm");
// Отправка на клиента сообщение закончено, добавить функцию показа сообщения

myForm.addEventListener("submit", function(event) {
	event.preventDefault();
	var username = document.getElementById("username").value;
	ws.send(JSON.stringify({
		"username": username
	}));
});


ws.onmessage = (event) => {
	let data = JSON.parse(event.data)
	console.log(data)

	if ('message' in data) {
		const li3 = document.createElement("li");
		li3.classList.add("on-us")
		li3.innerHTML = data.message;
		chat.appendChild(li3);
	} else {
		presenceEl.innerHTML = data.online;

		const li1 = document.createElement('li');
		li1.innerHTML = data.msg;
		messagesEl.appendChild(li1);
	  
		onlineUsers.innerHTML = "";
		data.users.forEach(user => {
		  const li2 = document.createElement("li");
		  li2.classList.add("on-us")
		  li2.innerHTML = user;
		  onlineUsers.appendChild(li2);
		});
	}
};

sendMessageButton.onclick = () => {
	let message = messageInput.value
	let username = document.getElementById("username").value
	ws.send(JSON.stringify({
		"user": username,
		"message": message,
	}));
	messageInput.value = '';
};