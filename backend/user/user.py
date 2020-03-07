import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json

app = flask.Flask(__name__)
CORS(app,supports_credentials=True)
#mongo_url = "mongodb://mongo-data:27017/"
mongo_url = "mongodb://localhost:27017/"
@app.route("/api/user/v1/newfile", methods=["POST"])
#upload successful 200
#upload failed - conflict 409
def newfile():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        filename = flask.request.form["filename"]
        query = {"filename":filename}
        document = user_data.find(query)
        count = 0
        for x in document:
                #file exists
                return flask.Response(status=status.HTTP_409_CONFLICT)
        if (count == 0):
                #no files exist
                console.log(flask.request.files)
                data =''
                with open(filename,'r') as datafile:
                        data = datafile.read()
                query = {"username":flask.request.cookies["username"],"filename":filename,"file_data":flask.request.files[filename]}
                document = user_data.insert_one(query)
                return flask.Response(status=status.HTTP_200_OK)

@app.route("/api/user/v1/get_file_list", methods=["POST"])
#200 - send data
#204 - no data
def get_file_list():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":flask.request.cookies["username"]}
        document = user_data.find(query)
        count = 0
        file_list = []
        for x in document:
                count += 1
                file_list.append(x)
        if (count == 0):
                return flask.Response(status=status.HTTP_204_NO_CONTENT)
        else:
                return json.dumps(file_list)


@app.route("/api/user/v1/delete_file", methods=["POST"])
#200 OK
def delete_file():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":flask.request.cookies["username"],"filename":flask.request.form["filename"]}
        document = user_data.delete_one(query)
        return flask.Response(status = status.HTTP_200_OK)
        
if (__name__ == "__main__"):
        app.run(port=5000)
        