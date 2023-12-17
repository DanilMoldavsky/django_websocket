from channels.generic.websocket import WebsocketConsumer

import os
import json

class PresenceConsumer(WebsocketConsumer):

    connections = []
    
    names = []
    def connect(self):
        self.accept()
        self.user = self.scope.get('user')

        self.connections.append(self)
        self.update_indicator(msg="Connected")

    def disconnect(self, code):
        self.update_indicator(msg="Disconnected")
        self.connections.remove(self)
        # обращение через метод питона super() к родительскому классу
        return super().disconnect(code)

    def update_indicator(self, msg):
        for connection in self.connections:
            text_data = json.dumps(
				{
					"msg": f"{self.user}: {msg}",
					"online": f"{len(self.connections)}",
					"users": [str(client.user) for client in self.connections],
				}
			)
            
            
            connection.send(text_data=text_data) 
    
    
    def send_message(self, message: json='', bytes_data: bytes=None):
        if bytes_data != None:
            for client in self.connections:
                client.send(bytes_data = bytes_data)
        else:
            for client in self.connections:
                client.send(message)
    
    # приняли дату и отправили на клиент, клиент получил байт данные
    # Данные отправляются в ввиде байтовой строки type - bytes
    #TODO: нужно принять данные, обработать и добавить элемент в html
    file_parts = {}
    def receive(self, text_data='', bytes_data=None):
        # text_data_json = json.loads(text_data)
        
        if bytes_data != None:
            byte_array = bytes_data
            self.send_message(bytes_data = byte_array)
        try:
            username = text_data_json['username']
            
            self.user = username
            self.names.append(username)
            self.update_indicator(msg='Update Username')
        except KeyError:
            try:
                chunk = text_data_json['chunk']
                total_chunks = text_data_json['totalChunks']
                file_part = bytes_data

                # Сохраните принятую часть файла в массиве
                self.file_parts.extend(file_part)

                if len(self.file_parts) == total_chunks:
                    print('Получено все части файла')
                    # Если получены все части файла, то соберите и сохраните его
                    file_bytes = bytes(self.file_parts)

                    image_name = f"image_{self.user}.jpg"  # Пример имени файла
                    image_path = os.path.join('media', image_name)

                    with open(image_path, 'wb') as file:
                        file.write(file_bytes)

                    # Очистите массив для следующего файла
                    self.file_parts = []

                    print(text_data)
                
            except KeyError:
                username = text_data_json['user']
                message = text_data_json['message']
                self.send_message(json.dumps({
                    'message': f'{username}: {message}',
                }))