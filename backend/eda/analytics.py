import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json
import os
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
        return file_data  # returns a string
    else:
        return 0


def get_fields(file_data, fieldlist):
    # fieldlist is a list containing indices of fields to be extracted
    data = [[], [], []]
    j = 0
    for item in fieldlist:
        i = 0
        for line in file_data:
            a = line.split(",")
            #print(a)
            if(i == 0):
                ind = a.index(item)
                # print(a)
                i += 1
                continue
            if(len(a) == len(a)):
                try:
                    data[j].append(float(line.split(",")[ind]))
                except:
                    pass
        #print(data)
        j += 1
    return data


@app.route("/api/eda/v1/get_scatter/<filename>", methods=["POST"])
# file doesn't exist 406 not acceptable
# valid 200
def get_scatter(filename):
    data = flask.request.form
    file_data = get_file_data(flask.request.cookies["username"], filename)
    if (file_data == 0):
        return status.HTTP_406_NOT_ACCEPTABLE
    else:
        file_data = file_data.split("\n")
        dpoints = get_fields(file_data, [data["x"], data['y'], data['target']])
        #print(dpoints)
        return {"x": dpoints[0], "y": dpoints[1], "target": dpoints[2]}, 200


@app.route("/api/eda/v1/gen_view/<filename>", methods=["GET"])
# file doesn't exist 406 not acceptable
# valid 200
def gen_view(filename):
    data = get_file_data(flask.request.cookies["username"], filename)
    data = data.split("\n")
    if (data != 0):
        out_json = list()
        headers = data[0]
        headers = headers.split(",")
        for line in data[1:50]:
            info = line.split(",")
            a = dict()
            for index in range(len(headers)):
                try:
                    a[headers[index][1:-1]] = info[index]
                except:
                    break
            out_json.append(a)
        header_out = list()
        for item in headers:
            header_out.append({"title": item[1:-1], "field": item[1:-1]})
        return {"headers": header_out, "data": out_json}, 200
    else:
        return flask.Response(status=status.HTTP_406_NOT_ACCEPTABLE)


if __name__ == '__main__':
    app.run(port=6001)
