from django.shortcuts import render
from webchat.consumers import PresenceConsumer

# Create your views here.

def index(request):
    # names = PresenceConsumer.names  # Получение значения переменной names из класса PresenceConsumer
    # return render(request, 'index.html', {'name': names})
	return render(request, 'index.html')