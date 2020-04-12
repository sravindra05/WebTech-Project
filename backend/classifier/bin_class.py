import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json
import hashlib
from io import StringIO
import pandas as pd
import numpy as np
import keras.models as km
from keras import Sequential
from keras.layers import Dense
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
model = Sequential()
# First Hidden Layer

app = flask.Flask(__name__)
CORS(app, supports_credentials=True)
mongo_url = "mongodb://localhost:27017/"


def get_file_data(username, filename):
    myclient = pymongo.MongoClient(mongo_url)
    db = myclient["data_db"]
    user_data = db["data"]
    query = {"username": username, "filename": filename}
    document = user_data.find(query)
    count = 0
    file_data = ''
    for x in document:
        count += 1
        file_data = x['file_data']
    if (count != 0):
        return file_data
    else:
        return 0


@app.route("/api/bin_class/v1/get_features/<filename>", methods=["GET"])
def get_features(filename):
    data = get_file_data(flask.request.cookies['username'], filename)
    if (data == 0):
        return status.HTTP_406_NOT_ACCEPTABLE
    else:
        cols = data.split('\n')[0].split(',')
        return json.dumps({'features': cols})


@app.route("/api/bin_class/v1/train/<filename>", methods=["PUT"])
def train(filename):
    data = get_file_data(flask.request.cookies['username'], filename)
    df = pd.read_csv(StringIO(data))
    features = flask.request.form['features'].split(',')
    target = flask.request.form['target']
    print(len(features))
    Y = np.array(df[target])
    t_data = np.array(df[features])
    print(t_data)
    sc = StandardScaler()
    X = sc.fit_transform(t_data)

    global model
    classifier = Sequential()
    classifier.add(Dense(4, activation='relu', input_dim=len(features)))
    classifier.add(Dense(4, activation='relu'))
    classifier.add(Dense(1, activation='sigmoid'))
    classifier.compile(
        optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    classifier.fit(X, Y, batch_size=2, epochs=10)
    model = classifier
    model.save("./user_models/" +
               flask.request.cookies["username"]+"_model.h5", overwrite=True)
    # print(model.predict(np.array([[6, 100, 0, 33.6, 0.627]])))
    return flask.Response(status=200)


@app.route("/api/bin_class/v1/query/<filename>", methods=["POST"])
def query(filename):
    features = list(
        map(lambda x: float(x), flask.request.form['features'].split(',')))
    print(np.array(features))
    pred_model = km.load_model(
        "./user_models/"+flask.request.cookies["username"]+"_model.h5", compile=False)
    pred_model._make_predict_function()
    #g = tf.get_default_graph()
    # with g.as_default():
    pred = pred_model.predict(np.array([features]))
    print(pred)
    return flask.Response(status=202)


if __name__ == '__main__':
    app.run(port=7001)
