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
		"username": username
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


// function sendFile(file) {
//     const reader = new FileReader();
 
//     reader.onload = function(event) {
//         socket.send(event.target.result);
//     };
 
//     reader.readAsArrayBuffer(file);
// }


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

	//! Отправка картинок на сервер
    const fileInput = document.getElementById('myImage');
	const file = fileInput.files[0];
	// const chunkSize = 4096; // Размер каждого куска в байтах
	
	// const totalChunks = Math.ceil(file.size / chunkSize);
	// let currentChunk = 0;
	// let fileParts = [];
	// let filePartsStr = []; 

	
	// function uploadChunk(chunk) {
	// 	// const formData = new FormData();
	// 	const start = chunk * chunkSize;
	// 	const end = Math.min(start + chunkSize, file.size);
	// 	const chunkData = file.slice(start, end);

	// 	const reader = new FileReader();
	// 	reader.onload = function(event) {
	// 		const chunkBytes = new Uint8Array(event.target.result);

	// 		// Сохраните принятую часть файла в массиве
	// 		fileParts.push(...chunkBytes);
	// 		filePartsArray = Array.from(fileParts)
			
	// 		filePartsArray.forEach(chunkBytes => {
	// 			const base64 = btoa(String.fromCharCode.apply(null, chunkBytes));
	// 			filePartsStr.push(base64);
	// 		  });
	// 		console.log(filePartsStr)
	// 		if (chunk === totalChunks - 1) {
	// 			// Если получены все части файла, отправьте массив на сервер
	// 			const message = {
	// 				user: username,
	// 				totalChunks,
	// 				file: Array.from(fileParts)  // Преобразуйте массив Uint8Array в обычный массив
	// 			};
			
	// 			// Отправка части файла через WebSocket
	// 			ws.send(JSON.stringify(message));
	// 			console.log(message)
	// 		}
	// 	};
	// 	reader.readAsArrayBuffer(chunkData);
	// }
	// // while (currentChunk < totalChunks) {
	// // 	uploadChunk(currentChunk);
	// // 	currentChunk++;
	// // }
	// uploadChunk(currentChunk);

	function sendFile(file) {
		// var data = ctx.getImageData(0, 0, 200, 200).data;
		var reader = new FileReader();
		reader.onload = function(event) {
			var byteArray = new Uint8Array(event.target.result);
			ws.send(byteArray.buffer);
			console.log(byteArray.buffer);
			console.log(byteArray);
		};
		reader.readAsArrayBuffer(file);
	}
	sendFile(file)
	//! Конец блока с отправкой на сервер картинки

	// ws.send(JSON.stringify({
	// 	"user": username,
	// 	"message": message,
	// }));
	// messageInput.value = '';
};
