import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json

app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploaded_files/'
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
        for _ in document:
                #file exists
                return flask.Response(status=status.HTTP_409_CONFLICT)
        if (count == 0):
                #no files exist
                data =''
                print("FILES:",flask.request.files)
                flask.request.files['file_itself'].save(app.config['UPLOAD_FOLDER']+filename)
                with open(app.config['UPLOAD_FOLDER']+filename,'r') as datafile:
                        data = datafile.read()
                query = {"username":flask.request.cookies["username"],"filename":filename,"file_data":data,"file_size":len(data)}
                document = user_data.insert_one(query)
                return flask.Response(status=status.HTTP_200_OK)

@app.route("/api/user/v1/get_file_list", methods=["GET"])
#200 - send data
#204 - no data
def get_file_list():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":flask.request.cookies["username"]}
        document = user_data.find(query,{"_id":0,"file_data":0})
        count = 0
        file_list = []
        for x in document:
                count += 1
                file_list.append(x)
        if (count == 0):
                return flask.Response(status=status.HTTP_204_NO_CONTENT)
        else:
                return json.dumps(file_list)


@app.route("/api/user/v1/delete_file/<string:filename>", methods=["DELETE"])
#200 OK
def delete_file(filename):
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":flask.request.cookies["username"],"filename":filename}
        user_data.delete_one(query)
        return flask.Response(status = status.HTTP_200_OK)
        
if (__name__ == "__main__"):
        app.run(port=5000)
        