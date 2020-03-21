import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json
import hashlib

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


if __name__ == '__main__':
    app.run(port=7001)
