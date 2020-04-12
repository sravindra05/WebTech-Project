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
import os
import fcntl

app = flask.Flask(__name__)
CORS(app, supports_credentials=True)

mongo_url = "mongodb://localhost:27017/"
if (os.environ.get("MONGO_URL") != None):
    mongo_url = os.environ.get("MONGO_URL")


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
#returns 423 file in use
def train(filename):
    data = get_file_data(flask.request.cookies['username'], filename)
    df = pd.read_csv(StringIO(data))
    features = flask.request.form['features'].split(',')
    target = flask.request.form['target']
    save_name = "|".join(features)+"!"+target+"!"+filename
    filepath = "./user_models/" + flask.request.cookies["username"]+'/'+save_name +".h5"
    print(len(features))
    Y = np.array(df[target])
    t_data = np.array(df[features])
    print(t_data)
    sc = StandardScaler()
    X = sc.fit_transform(t_data)
    print(X)
    if (not os.path.exists("./user_models/"+flask.request.cookies["username"])):
        #create folder for the user
        os.mkdir("./user_models/"+flask.request.cookies["username"])
    classifier = None
    if (os.path.exists(filepath)):
        #file exists..acquire lock
        handle = open(filepath+".lock","w+")
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            classifier = Sequential()
            classifier.add(Dense(4, activation='relu', input_dim=len(features)))
            classifier.add(Dense(4, activation='relu'))
            classifier.add(Dense(1, activation='sigmoid'))
            classifier.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
            classifier.fit(X, Y, batch_size=2, epochs=10)
            classifier.save(filepath, overwrite=True)
            fcntl.flock(handle, fcntl.LOCK_UN)
            handle.close()
            return flask.Response(status=200)
        except IOError as e:
            #file is being used, cannot save model
            return flask.Response(status=423)
        finally:
            handle.close()
    else:
        #file is new
        classifier = Sequential()
        classifier.add(Dense(4, activation='relu', input_dim=len(features)))
        classifier.add(Dense(4, activation='relu'))
        classifier.add(Dense(1, activation='sigmoid'))
        classifier.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        classifier.fit(X, Y, batch_size=2, epochs=10)
        classifier.save(filepath, overwrite=True)
        handle = open(filepath+".lock","w+").close()
        return flask.Response(status=200)

@app.route("/api/bin_class/v1/query/<modelname>", methods=["POST"])
#403 model not found
#423 file busy
def query(modelname):
    if (not os.path.exists("./user_models/"+flask.request.cookies["username"]+"/"+modelname)):
        return flask.Response(status =403)
    else:
        handle = open("./user_models/"+flask.request.cookies["username"]+"/"+modelname+".lock",'w+')
        pred = {}
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            pred_model = km.load_model("./user_models/"+flask.request.cookies["username"]+"/"+modelname)
            data = flask.request.form
            values =[]
            for item in data:
                values.append(int(data[item]))
            pred = pred_model.predict(np.array([values]))
            fcntl.flock(handle, fcntl.LOCK_UN)
            handle.close()
            return json.dumps(pred.tolist())
        except IOError as e:
            #file is busy return 423
            handle.close()
            return flask.Response(status = 423)
        
        

@app.route("/api/bin_class/v1/get_models/<filename>")
#return 201 if dir not found
#return 200 with data
def get_models(filename):
    if (os.path.exists("./user_models/"+flask.request.cookies["username"])):
        #dir exists
        content = os.listdir("./user_models/"+flask.request.cookies["username"])
        models = dict()
        count = 0
        for item in content:
            if (item.find(filename)>0 and item.find(".lock") < 0):
                models[count] = {"filename":item,"id":count,"features":item.split("!")[0].split("|"),"target":item.split("!")[1]}
                count += 1
        return models, 200
    else:
        return flask.Response(status=201)

@app.route("/api/bin_class/v1/delete_model/<modelname>",methods=["DELETE"])
#return 200 - model deleted
#return 403 - model not found
def delete(modelname):
    if (os.path.exists("./user_models/"+flask.request.cookies["username"]+"/"+modelname)):
        os.remove("./user_models/"+flask.request.cookies["username"]+"/"+modelname)
        os.remove("./user_models/"+flask.request.cookies["username"]+"/"+modelname+".lock")
        return flask.Response(status=200)
    else:
        return flask.Response(status=403)
    
if __name__ == '__main__':
    app.run(port=7001)
