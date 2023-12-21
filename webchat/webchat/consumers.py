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
                    "type": 'update'
				}
			)
            connection.send(text_data=text_data) 
    
    
    def send_message(self, message: json='', bytes_data: bytes=None):
        if bytes_data != None:
            for client in self.connections:
                client.send(bytes_data = bytes_data)
        else:
            for client in self.connections:
                client.send(text_data = message)
    

    def receive(self, text_data='', bytes_data=None):
        text_data_json = json.loads(text_data)
    
        if text_data_json.get('type', None) == 'update':
            username = text_data_json.get('username', None)
            
            self.user = username
            self.names.append(username)
            self.update_indicator(msg='Update Username')
        else:
                # username = text_data_json['user']
                message = text_data_json.get('message', None)
                self.send_message(json.dumps({
                    'username': self.user,
                    'message': message,
                    'img' : text_data_json.get('img', None),
                    'type': 'chat'
                }))