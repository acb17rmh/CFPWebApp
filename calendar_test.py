import pymongo
import os
import datetime
from ics import Calendar, Event

client = pymongo.MongoClient(os.environ.get("DATABASE"))
db = client["cfpscanner"]
conferences_collection = db["conferences"]


def make_calendars():
    conferences = conferences_collection.find({})
    for conference in conferences:
        cal = Calendar()

        submission_event = Event()
        submission_event.name = "Submission deadline: " + conference['conference_name']
        submission_deadline = datetime.datetime.strptime(conference['submission_deadline'], '%a, %d %b %Y %H:%M:%S %Z').date()
        submission_event.begin = submission_deadline
        cal.events.add(submission_event)

        conference_start_event = Event()
        conference_start_event.name = "Conference: " + conference['conference_name']
        start_date = datetime.datetime.strptime(conference['start_date'], '%a, %d %b %Y %H:%M:%S %Z').date()
        conference_start_event.begin = start_date
        conference_start_event.location = conference['location']
        cal.events.add(conference_start_event)

        with open('./my.ics', 'w') as my_file:
            my_file.writelines(cal)

make_calendars()