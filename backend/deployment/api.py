import json
import requests
import sys
import hashlib
url = 'http://34.70.248.118:80/api/'
payload = {'imei':str(hashlib.sha256("865758031358689".encode('utf-8')).hexdigest()),'phone_number':str(hashlib.sha256("9449005666".encode('utf-8')).hexdigest()),'bankID':"0",'mob':str(hashlib.sha256("9449005666".encode('utf-8')).hexdigest())}
headers = {'content-type': 'application/json'}
print(payload)
r = requests.post(url, data=json.dumps(payload), headers=headers)
ret = r.content
print(ret.decode('ascii'))

#9449005666
