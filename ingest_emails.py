from imap_tools import MailBox
import pymongo
import requests
import os
import datetime

"""
Searches the CFPScanner email address for messages and classifies them. Any CFPs are labelled and their information extracted
and saved into a database collection. All other emails are discarded.
"""

# database and IMAP configuration
client = pymongo.MongoClient(os.environ.get("DATABASE"))
db = client["cfpscanner"]
email_collection = db["emails"]
conferences_collection = db["conferences"]
mailbox = MailBox('imap.mail.com')
emails = []

# get today's date as a Date object
todays_date = datetime.date.today()

def read_emails(username, password):
    mailbox.login(username, password, initial_folder='INBOX')
    for msg in mailbox.fetch():
        email_data = {'body': msg.text}
        emails.append(email_data)
    # mailbox.move(mailbox.fetch(), 'processed')
    mailbox.logout()
    return None

def predict_emails():
    """
    For each email in the collection, run them through the API and store any extracted conferences
    in the conference collection.
    """
    for email_body in emails:
        data = requests.post(os.environ.get('SERVER_URL'), json=email_body).json()
        if data['prediction'] == "cfp":
            conferences_collection.insert_one(data)
    return None

def clear_old_conferences():
    conferences = conferences_collection.find({})
    for conference in conferences:
        conference_date = datetime.datetime.strptime(conference['submission_deadline'], '%a, %d %b %Y %H:%M:%S %Z').date()
        print (conference_date)
        if todays_date > conference_date:
            conferences_collection.delete_one({"submission_deadline": conference['submission_deadline']})


read_emails(os.environ.get('EMAIL_ADDRESS'), os.environ.get('EMAIL_PASSWORD'))
predict_emails()
clear_old_conferences()