import en_core_web_sm
from collections import Counter

nlp = en_core_web_sm.load()
input_text = "We’ve made changes to our Terms of Service and Privacy Policy. They take effect on September 1, 2020, and we encourage you to review them. By continuing to use our services, you agree to the new Terms of Service and acknowledge the Privacy Policy applies to you."


def extract_keywords(input_text):
    keywords = []
    tags = ['NOUN', 'PROPN']
    doc = nlp(input_text.lower())
    for token in doc:
        if (token.text in nlp.Defaults.stop_words):
            continue
        if (token.pos_ in tags):
            keywords.append(token.text)

    return [x[0] for x in Counter(keywords).most_common(5)]


print(extract_keywords(input_text))
