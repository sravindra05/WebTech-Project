import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json

app = flask.Flask(__name__)
CORS(app)

@app.route("/uac/api/v1/login", methods=["POST"])
#user doesn't exist 403 forbidden
#valid 202 accepted
#invalid password 401 unauthorised
def login():
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["auth_db"]
        user_data = db["data"]
        query = {"username":flask.request.json["username"],"password":flask.request.json["password"]}
        document = user_data.find(query)
        if (len(document) == 0):
                return status.HTTP_403_FORBIDDEN
        else:
                for x in document:
                        if (x['password'] == flask.request.json["password"]):
                                #valid
                                return status.HTTP_202_ACCEPTED
                        else:
                                return status.HTTP_401_UNAUTHORIZED

@app.route("/uac/api/v1/check", methods=["POST"])
# user doesn't exist 403 forbidden
# valid loginstring 202 accepted
# invalid login 401 unauthorized
def check_login():
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["auth_db"]
        user_data = db["data"]
        query = {"username":flask.request.cookies["username"]}
        document = user_data.find(query)
        if (len(document) == 0):
                return status.HTTP_403_FORBIDDEN
        else:
                for x in document:
                        if (x['loginstring'] == flask.request.cookies['loginstring']):
                                #valid
                                return status.HTTP_202_ACCEPTED
                        else:
                                return status.HTTP_401_UNAUTHORIZED


@app.route("/uac/api/v1/signup", methods=["POST"])
# user exists 403 forbidden
# valid 202 accepted
# invalid password 400 bad request
def signup():
        myclient = pymongo.MongoClient("mongodb://mongo-data:27017/")
        db = myclient["auth_db"]
        user_data = db["data"]
        if (len(flask.request.json['password']) == 0):
                return status.HTTP_400_BAD_REQUEST
                 
        query = {"username":flask.request.json["username"]}
        document = user_data.find(query)
        if (len(document) > 0):
                return status.HTTP_403_FORBIDDEN
        else:
                query = {"username":flask.request.json["username"],"password":flask.request.json["password"]}
                document = user_data.insert_one(query)
                return status.HTTP_202_ACCEPTED