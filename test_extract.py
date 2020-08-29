from imap_tools import MailBox
import pymongo
import os
import datetime

from app import extract_keywords

"""
Searches the CFPScanner email address for messages and classifies them. Any CFPs are labelled and their information extracted
and saved into a database collection. All other emails are discarded.
"""

# database and IMAP configuration
mailbox = MailBox('imap.mail.com')

def read_emails(username, password):
    mailbox.login(username, password, initial_folder='INBOX')
    for msg in mailbox.fetch():
        print(extract_keywords(msg.text))
    mailbox.logout()
    return None


read_emails(os.environ.get("EMAIL_ADDRESS"), os.environ.get("EMAIL_PASSWORD"))


