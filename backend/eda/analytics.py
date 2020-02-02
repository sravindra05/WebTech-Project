import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json

app = flask.Flask(__name__)
CORS(app)

def check_login(username,loginstring):
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["auth_db"]
        user_data = db["data"]
        query = {"username":username}
        document = user_data.find(query)
        if (len(document) == 0):
                return 1
        else:
                for x in document:
                        if (x['loginstring'] == loginstring):
                                #valid
                                return 0
                        else:
                                return 2

def get_file_data(username, filename):
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":username,"filename":filename}
        document = user_data.find(query)
        if (len(document) == 0):
                return 1
        else:
                for x in document:
                        file_data = x['file_contents']
                return file_data

def write_file_db(username, filename,filedata):
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":username,"filename":filename,"file_contents":filedata}
        document = user_data.insert_one(query)

@app.route("/eda/api/v1/get_simple_line_graph",methods=["POST"])
#file doesn't exist 406 not acceptable
#incorrect password 401 unauthorised
#non existent user 403 forbidden
def get_simple_line_graph():
        data = flask.request.json #filename,index_a,index_b
        auth = check_login(flask.request.cookies['username'],flask.request.cookies['loginstring'])
        if (auth == 0):
                filename = data['filename']
                start = data['rangestart']
                end = data['rangeend']
                file_data = get_file_data(username,filename)
                if (file_data == 1):
                        return status.HTTP_406_NOT_ACCEPTABLE
                else:
                        x_axes = []
                        y_axes = []
                        file_data = file_data.split("\n")
                        for item in file_data:
                                x_axes.append(item.split(",")[data["index_a"]])
                                y_axes.append(item.split(",")[data["index_b"]])
                        return {"x":x_axes,"y":y_axes}
        if (auth == 2):
                #incorrect password
                return status.HTTP_401_UNAUTHORISED
        if (auth == 1):
                #non existent user
                return status.HTTP_403_FORBIDDEN


@app.route("/eda/api/v1/upload_file",methods=["POST"])
#incorrect password 401 unauthorised
#non existent user 403 forbidden
#accepted 202 
def upload_file():
        auth = check_login(flask.request.cookies['username'],flask.request.cookies['loginstring'])
        if (auth == 0):
                upload = flask.request.files['file']
                upload.save(upload.filename)
                with open(upload.filename, 'r') as x:
                        write_file_db(flask.request.cookies["username"],upload.filename,x.read())
                return status.HTTP_202_ACCEPTED
        if (auth == 2):
                #incorrect password
                return status.HTTP_401_UNAUTHORISED
        if (auth == 1):
                #non existent user
                return status.HTTP_403_FORBIDDEN


@app.route("/eda/api/v1/get_files",methods=["POST"])
#incorrect password 401 unauthorised
#non existent user 403 forbidden
def get_file_list():
        auth = check_login(flask.request.cookies['username'],flask.request.cookies['loginstring'])
        if (auth == 0):
                myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
                db = myclient["data_db"]
                user_data = db["data"]
                query = {"username":username}
                document = user_data.insert_one(query)
        if (auth == 2):
                #incorrect password
                return status.HTTP_401_UNAUTHORISED
        if (auth == 1):
                #non existent user
                return status.HTTP_403_FORBIDDEN

if __name__ == '__main__':
        app.run(port = 8080)