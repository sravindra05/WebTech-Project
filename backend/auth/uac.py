import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json
import hashlib
import os
app = flask.Flask(__name__)
CORS(app,supports_credentials=True)

mongo_url = "mongodb://localhost:27017/"
if (os.environ.get("MONGO_URL") != None):
    mongo_url = os.environ.get("MONGO_URL")

@app.route("/api/uac/v1/login", methods=["POST"])
#user doesn't exist 403 forbidden
#valid 202 accepted
#invalid password 401 unauthorised
#bad request 400
def login():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["auth_db"]
        user_data = db["data"]
        if ((flask.request.form['password'] == hashlib.md5(b'').hexdigest()) or (flask.request.form['username'] == "")):
                return flask.Response(status=status.HTTP_400_BAD_REQUEST)

        query = {"username":flask.request.form["username"]}
        document = user_data.find(query)
        count = 0
        for x in document:
                count += 1
                if (x['password'] == flask.request.form["password"]):
                        #valid
                        resp  = flask.make_response()
                        resp.set_cookie("username",flask.request.form["username"])
                        resp.set_cookie("loginstring",flask.request.form["password"])
                        return resp,202
                else:
                        return flask.Response(status=status.HTTP_401_UNAUTHORIZED)
        if (count == 0):
                return flask.Response(status=status.HTTP_403_FORBIDDEN)

@app.route("/api/uac/v1/check", methods=["POST"])
# user doesn't exist 403 forbidden
# valid loginstring 202 accepted
# invalid login 401 unauthorized
def check_login():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["auth_db"]
        user_data = db["data"]
        if ('loginstring' not in flask.request.cookies or 'username' not in flask.request.cookies):
                return flask.Response(status=status.HTTP_204_NO_CONTENT)
        if ((flask.request.cookies['loginstring'] == hashlib.md5(b'').hexdigest()) or (flask.request.cookies['username'] == "")):
                return flask.Response(status=status.HTTP_204_NO_CONTENT)
        query = {"username":flask.request.cookies["username"]}
        document = user_data.find(query)
        count = 0        
        for x in document:
                count += 1
                if (x['password'] == flask.request.cookies['loginstring']):
                        #valid
                        return flask.Response(status=status.HTTP_202_ACCEPTED)
                else:
                        return flask.Response(status=status.HTTP_401_UNAUTHORIZED)
        if (count == 0):
                return flask.Response(status=status.HTTP_403_FORBIDDEN)


@app.route("/api/uac/v1/signup", methods=["POST"])
# user exists 403 forbidden
# valid 202 accepted
# invalid password 400 bad request
def signup():
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["auth_db"]
        user_data = db["data"]
        
        if ((flask.request.form['password'] == hashlib.md5(b'').hexdigest()) or (flask.request.form['username'] == "")):
                return flask.Response(status=status.HTTP_400_BAD_REQUEST)

        query = {"username":flask.request.form["username"]}
        document = user_data.find(query)
        count = 0
        for _ in document:
                count += 1
        if (count !=0):
                return flask.Response(status=status.HTTP_403_FORBIDDEN)
        else:
                query = {"username":flask.request.form["username"],"password":flask.request.form["password"]}
                document = user_data.insert_one(query)
                return flask.Response(status=status.HTTP_202_ACCEPTED)

if (__name__ == "__main__"):
        app.run(port=4000)
        