import flask
from flask_api import status
from flask_cors import CORS
import requests
import pymongo
from datetime import date
import json

app = flask.Flask(__name__)
CORS(app,supports_credentials=True)
mongo_url = "mongodb://localhost:27017/"

def get_file_data(username,filename):
        myclient = pymongo.MongoClient(mongo_url)
        db = myclient["data_db"]
        user_data = db["data"]
        query = {"username":username,"filename":filename}
        document = user_data.find(query)
        count =0
        file_data = ''
        for x in document:
                count += 1
                file_data = x['file_data']
        if (count != 0):
                return file_data
        else:
                return 0

@app.route("/api/eda/v1/get_simple_line_graph/<string:filename>",methods=["GET"])
#file doesn't exist 406 not acceptable
#valid 200
def get_simple_line_graph(filename):
        data = flask.request.json
        start = data['rangestart']
        end = data['rangeend']
        file_data = get_file_data(flask.request.cookies["username"],filename)
        if (file_data == 0):
                return status.HTTP_406_NOT_ACCEPTABLE
        else:
                x_axes = []
                y_axes = []
                file_data = file_data.split("\n")
                for item in file_data:
                        x_axes.append(item.split(",")[data["index_a"]])
                        y_axes.append(item.split(",")[data["index_b"]])
                return {"x":x_axes,"y":y_axes}, 200

@app.route("/api/eda/v1/gen_view/<filename>",methods=["GET"])
#file doesn't exist 406 not acceptable
#valid 200
def gen_view(filename):
        data = get_file_data(flask.request.cookies["username"],filename)
        data = data.split("\n")
        if (data != 0):
                out_json = list()
                headers = data[0]
                headers = headers.split(";")
                for line in data[1:50]:
                        info = line.split(";")
                        a = dict()
                        for index in range(len(headers)):
                                try:
                                        a[headers[index][1:-1]] = info[index]
                                except:
                                        break
                        out_json.append(a)
                header_out = list()
                for item in headers:
                        header_out.append({"title":item[1:-1],"field":item[1:-1]})
                return {"headers":header_out,"data":out_json},200
        else:
                return flask.Response(status = status.HTTP_406_NOT_ACCEPTABLE)
  

if __name__ == '__main__':
        app.run(port = 6001)