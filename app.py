from flask import Flask, render_template, request

import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB


app = Flask(__name__)


@app.route('/')
@app.route('/<name>')
def hello_world(name=None):
    return render_template("index.html", name=name)

@app.route('/predict', methods=['POST'])
def predict():
        df = pd.read_csv("corpus.csv", encoding="latin-1").fillna(" ")
        df.drop_duplicates(inplace=True)
        data_train, data_test = train_test_split(df, test_size=0.8, shuffle=True, random_state=1000)
        vectorizer = CountVectorizer(stop_words=stopwords.words("english"), lowercase=True)
        train_counts = vectorizer.fit_transform(data_train['text'])
        classifier = MultinomialNB()
        targets = data_train["class_label"]
        classifier.fit(train_counts, targets)

        if request.method == "POST":
                input_text = request.form["input_text"]
                input_data = [input_text]
                vectorized_data = vectorizer.transform(input_data)
                prediction = classifier.predict(vectorized_data)
                print (prediction)
        return render_template('results.html', prediction=prediction)

if __name__ == '__main__':
    app.run()
