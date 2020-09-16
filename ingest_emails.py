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
    mailbox.move(mailbox.fetch(), 'processed')
    mailbox.logout()
    return None


def predict_emails():
    """
    For each email in the collection, run them through the API and store any extracted conferences
    in the conference collection.
     """
    for email_body in emails:
        data = requests.post(os.environ.get('SERVER_URL'), json=email_body).json()
        if data['prediction'] == "cfp" and data['submission_deadline'] is not None and data['start_date'] is not None and data['location'] is not None:
            data['submission_deadline'] = datetime.datetime.strptime(data['submission_deadline'], '%a, %d %b %Y %H:%M:%S %Z')
            data['start_date'] = datetime.datetime.strptime(data['start_date'], '%a, %d %b %Y %H:%M:%S %Z')
            data['date_added'] = datetime.datetime.strptime(data['date_added'], '%a, %d %b %Y %H:%M:%S %Z')

            if data['notification_due']:
                data['notification_due'] = datetime.datetime.strptime(data['notification_due'], '%a, %d %b %Y %H:%M:%S %Z')
            if data['final_version_deadline']:
                data['final_version_deadline'] = datetime.datetime.strptime(data['final_version_deadline'], '%a, %d %b %Y %H:%M:%S %Z')
            conferences_collection.insert_one(data)
    return None


def clear_old_conferences():
    conferences = conferences_collection.find({})
    for conference in conferences:
        if todays_date > conference['submission_deadline']:
            conferences_collection.delete_one({"submission_deadline": conference['submission_deadline']})
        if todays_date > conference['start_date']:
            conferences_collection.delete_one({"start_date": conference['start_date']})


print("Reading new emails...")
read_emails(os.environ.get('EMAIL_ADDRESS'), os.environ.get('EMAIL_PASSWORD'))
print("Classifying and extracting information...")
predict_emails()
print("Clearing old entries...")
# clear_old_conferences()
print("Ingesting finished!")
