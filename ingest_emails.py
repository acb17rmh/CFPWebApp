from imap_tools import MailBox
import pymongo
import requests
import os

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


def predict_emails():
    """
    For each email in the collection, run them through the API and store any extracted conferences
    in the conference collection.
    """
    for email_body in email_collection.find({}, {'_id': 0, 'body': 1}):
        data = requests.post(os.environ.get('SERVER_URL'), json=email_body).json()
        if data['prediction'] == "cfp":
            conferences_collection.insert_one(data)
    return None


read_emails(os.environ.get('EMAIL_ADDRESS'), os.environ.get('EMAIL_PASSWORD'))
predict_emails()
