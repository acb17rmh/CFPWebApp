import requests

url = 'http://localhost:5000/api'
r = requests.post(url, json={'data': "Hi Jochen, Hope you've been having a nice summer. I have some spare time at the moment so I wanted to talk to you about deploying the CFP project somewhere and open sourcing the code. It's written in Python so I've been looking into Flask/Django to make a small web app which could be hosted online. Would this be along the right lines in your opinion? thanks, Richard"})
print(r.json())