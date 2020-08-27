from imap_tools import MailBox
import pymongo
import requests

"""
Searches the CFPScanner email address for messages and classifies them. Any CFPs are labelled and their information extracted
and saved into a database collection. All other emails are discarded.
"""

# database configuration
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["cfpscanner"]
email_collection = db["emails"]
conferences_collection = db["conferences"]
url = 'http://localhost:5000/api'

# account credentials
username = "cfpscanner@mail.com"
password = "$a9nKKbJXq7G3V5r"

mailbox = MailBox('imap.mail.com')


def read_emails(username, password):
    mailbox.login(username, password, initial_folder='INBOX')
    for msg in mailbox.fetch():
        email_data = {'from:': msg.from_,
                      'subject': msg.subject,
                      'date': msg.date,
                      'body': msg.text}
        email_collection.insert_one(email_data)
    mailbox.move(mailbox.fetch(), 'processed')
    mailbox.logout()
    return None


def predictEmails():
    """
    For each email in the collection, run them through the API and store any extracted conferences
    in the conference collection.
    """
    for email_body in email_collection.find({}, {'_id': 0, 'body': 1}):
        data = requests.post(url, json=email_body).json()
        if data['prediction'] == "cfp":
            conferences_collection.insert_one(data)
    return None

read_emails(username, password)
predictEmails()
