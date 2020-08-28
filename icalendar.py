import requests
import icalendar



data = requests.get("http://localhost:5000/get_conferences").json()

for conference in data:
    cal = Calendar()