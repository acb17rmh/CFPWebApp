from flask import Flask, render_template, request

import dateparser
import re
import en_core_web_sm
import pickle

app = Flask(__name__)

# Regex patterns for identifying which date is which
CONFERENCE_DATES_REGEX = re.compile("|".join(["when", "workshop", "held", "conference", "held"]))
SUBMISSION_DEADLINE_REGEX = re.compile("|".join(["submit", "submission", "paper", "due", "deadline"]))
FINAL_VERSION_DEADLINE_REGEX = re.compile("|".join(["final", "camera", "ready", "camera-ready", "last", "manuscript"]))
NOTIFICATION_DEADLINE_REGEX = re.compile(
    "|".join(["notice", "notices", "notified", "notification", "notifications", "acceptance"]))
CONFERENCE_NAME_REGEX = re.compile(
    "|".join(["workshop", "conference", "meeting", "theme", "international", "symposium", "forum"]))
ORDINAL_REGEX = re.compile(
    "|".join(["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "nineth",
              "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]), re.IGNORECASE)
CONJUNCTION_REGEX = re.compile("|".join(["conjunction", "assosciate", "joint", "located"]), re.IGNORECASE)
WEB_URL_REGEX = re.compile(
    r"""(?i)\b((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:(?<!@)[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b/?(?!@)))""")

# Load nlp model and pretrained classifier/vectorizers
nlp = en_core_web_sm.load()
vectorizer = pickle.load(open("models/vectorizer.sav", 'rb'))
classifier = pickle.load(open("models/classifier.sav", 'rb'))


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == "POST":
        input_text = request.form["input_text"]
        input_data = [input_text]
        vectorized_data = vectorizer.transform(input_data)
        prediction = classifier.predict(vectorized_data)
        doc = nlp(input_text)
        split_cfp_text = preprocess_text(input_text)
        date_to_sentence = extract_dates(split_cfp_text)
    return render_template('results.html', input_text=input_text, prediction=prediction,
                           locations=extract_locations(doc),
                           conference_name=extract_conference_name(split_cfp_text),
                           start_date=get_start_date(date_to_sentence),
                           submission_deadline=get_submission_deadline(date_to_sentence),
                           notification_due=get_notification_due(date_to_sentence),
                           final_version_deadline=get_final_version_deadline(date_to_sentence))


def extract_locations(doc):
    """
    Extracts the first location mentioned in the CFP's text
    Args:
        doc: a spaCy document
    Returns:
        location: the first location mentioned in the text
    """

    for entity in doc.ents:
        if entity.label_ == "GPE":
            return entity.text

    return None


def extract_conference_name(split_cfp_text):
    """
    Function to extract the conference name from a CFP text. Uses rule-based patterns to assign scores to substrings
    of the CFP's text, and returns the one with the highest score. Takes regex patterns containing key words to filter
    by as parameters. By default, these regexes will match any string.
    Args:
        split_cfp_text: A list containing strings, where each string is a sentence in the original text.
    Returns:
        str: The highest ranking string in the text.
    """
    # a dictionary of form (sentence -> score)
    candidate_names = {}
    counter = 0

    conference_name_regex = re.compile(
        "|".join(["workshop", "conference", "meeting", "theme", "international", "symposium", "forum"]))
    ordinal_regex = re.compile(
        "|".join(["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "nineth",
                  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]), re.IGNORECASE)
    conjunction_regex = re.compile("|".join(["conjunction", "assosciate", "joint", "located"]), re.IGNORECASE)
    url_regex = re.compile(
        r"""(?i)\b((?:https?:(?:/{1,3}|[a-z0-9%])|[a-z0-9.\-]+[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)/)(?:[^\s()<>{}\[\]]+|\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\))+(?:\([^\s()]*?\([^\s()]+\)[^\s()]*?\)|\([^\s]+?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:(?<!@)[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\b/?(?!@)))""")

    for index, sent in enumerate(split_cfp_text):
        score = 0
        sent = sent.strip()
        next_sentence_bonus = False
        if len(sent.split()) < 4 or len(sent.split()) > 20:
            score -= 50
        if counter < 5:
            score += 10 - (2 * counter)
        if next_sentence_bonus:
            score += 10
        if "call for papers" in sent.lower():
            next_sentence_bonus = True
        if sent.endswith(" on") or sent.endswith(" for"):
            sent += " " + split_cfp_text[index + 1]
        if re.search(conference_name_regex, sent.lower()):
            score += 8
        if re.search(ordinal_regex, sent.lower()) and counter < 10:
            score += 10
        if re.search(conjunction_regex, sent.lower()):
            score -= 5
        if re.search(url_regex, sent.lower()):
            score -= 5

        candidate_names[sent] = score
        counter += 1

    # return the sentence with the highest score
    highest_score = (max(candidate_names, key=candidate_names.get)) if candidate_names else 0

    return highest_score


def preprocess_text(text):
    """
    Method to preprocess text for information extraction. Text is split on newlines and commas,
    and any conference names split over 2 lines are merged into one.
    Args:
        split_cfp_text: A list containing strings, where each string is a sentence in the original text.
    Returns:
        list: a list of preprocessed sentences.
    """

    text = text.replace('. ', '\n')
    text = text.replace('? ', '\n')
    text = text.replace('! ', '\n')
    text = text.splitlines()
    text = [substring for substring in text if substring is not ""]
    return text


def extract_dates(split_cfp_text):
    """
    Function which extracts mentions of dates from the CFP's text.
    Args:
        split_cfp_text: A list containing strings, where each string is a sentence in the original text.
    Returns:
        dict: A dictionary of form {date -> sentence containing that date}.
    """
    # a dictionary mapping a date to the sentence it is in
    date_to_sentence = {}

    for sentence_doc in nlp.pipe(split_cfp_text, batch_size=len(split_cfp_text), disable=["tagger", "parser"]):
        for entity in sentence_doc.ents:
            if entity.label_ == "DATE" and len(entity.text) >= 6:
                date = entity.text
                date_to_sentence[date] = sentence_doc.text[:]

        # removes any dates that cannot be parsed, i.e are incomplete, and makes sentence lowercase for next step
    date_to_sentence = {date: sent.lower() for date, sent in date_to_sentence.items() if
                        dateparser.parse(date) is not None}
    # returns a dictionary of form (date -> sentence)
    return date_to_sentence


def get_start_date(date_to_sentence):
    """
    Function to extract the start date of a conference from a Call for Paper.
    Args:
        date_to_sentence: a dictionary mapping each date in the text to the sentence containing it.
    Returns:
        conference_start: The date the conference starts, as a String.
    """

    if not date_to_sentence:
        return None

    conference_start = None

    for date in date_to_sentence:
        sentence = date_to_sentence[date].lower()
        date_object = dateparser.parse(date)

        if re.search(CONFERENCE_DATES_REGEX, sentence):
            conference_start = date_object

    # if no date found for start date, then use the first one found
    if conference_start is None:
        conference_start = list(date_to_sentence)[0]
        conference_start = dateparser.parse(conference_start)

    if conference_start is not None:
        conference_start = conference_start.strftime("%d/%m/%Y")

    return conference_start


def get_submission_deadline(date_to_sentence):
    """
    Function to extract the submission deadline of a conference from a Call for Paper.
    Args:
        date_to_sentence: a dictionary mapping each date in the text to the sentence containing it.
    Returns:
        submission_deadline: The submission deadline date, as a String.
    """
    if not date_to_sentence:
        return None
    submission_deadline = None
    for date in date_to_sentence:
        sentence = date_to_sentence[date].lower()
        date_object = dateparser.parse(date)

        if re.search(SUBMISSION_DEADLINE_REGEX, sentence):
            if submission_deadline is None:
                submission_deadline = date_object

    if submission_deadline is not None:
        submission_deadline = submission_deadline.strftime("%d/%m/%Y")

    return submission_deadline


def get_notification_due(date_to_sentence):
    """
    Function to extract the submission deadline of a conference from a Call for Paper.
    Args:
        date_to_sentence: a dictionary mapping each date in the text to the sentence containing it.
    Returns:
        notification_due: The notification due date, as a String.
    """
    if not date_to_sentence:
        return None
    notification_due = None
    for date in date_to_sentence:
        sentence = date_to_sentence[date].lower()
        date_object = dateparser.parse(date)

        if re.search(NOTIFICATION_DEADLINE_REGEX, sentence):
            if notification_due is None:
                notification_due = date_object

    if notification_due is not None:
        notification_due = notification_due.strftime("%d/%m/%Y")

    return notification_due


def get_final_version_deadline(date_to_sentence):
    """
    Function to extract the submission deadline of a conference from a Call for Paper.
    Args:
        date_to_sentence: a dictionary mapping each date in the text to the sentence containing it.
    Returns:
        final_version_deadline: The final version deadline date, as a String.
    """
    if not date_to_sentence:
        return None
    final_version_deadline = None
    for date in date_to_sentence:
        sentence = date_to_sentence[date].lower()
        date_object = dateparser.parse(date)

        if re.search(FINAL_VERSION_DEADLINE_REGEX, sentence):
            if final_version_deadline is None:
                final_version_deadline = date_object

    if final_version_deadline is not None:
        final_version_deadline = final_version_deadline.strftime("%d/%m/%Y")

    return final_version_deadline


if __name__ == '__main__':
    app.run()
