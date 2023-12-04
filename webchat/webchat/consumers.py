from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User

import json

class PresenceConsumer(WebsocketConsumer):

    connections = []

    def connect(self):
        self.accept()
        self.user = self.scope.get('user')

        self.connections.append(self)
        # user = User.objects.create_user("=SHB:JKAHSGFJK>H", password='12345')
        # self.djuser = user
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
            
            
            # if msg == 'Update Username':
            #     self.djuser.username = self.user 
            # self.djuser.save()
            # print(self.djuser)
            
            connection.send(text_data=text_data) 
    
    
    def send_message(self, message: str):
        for client in self.connections:
            client.send(message)
    
    
    def receive(self, text_data):
        
        text_data_json = json.loads(text_data)
        try:
            username = text_data_json['username']
            
            self.user = username
            self.update_indicator(msg='Update Username')
            # # Отправка ответа обратно клиенту
            # self.send(text_data=json.dumps({
            #     'message': f"Hello, {username}!"
            # }))
        except:
            self.send_message(text_data_json['message'])