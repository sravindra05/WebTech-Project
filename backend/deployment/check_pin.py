import json
import requests
import sys
import hashlib

url = 'http://34.70.248.118:80/pin/'
payload = {'imei': str(hashlib.sha256("865758031358689".encode('utf-8')).hexdigest()),'pin':str(hashlib.sha256("5632".encode('utf-8')).hexdigest()),'mob':str(hashlib.sha256("919871009701".encode('utf-8')).hexdigest())}
headers = {'content-type': 'application/json'}
print(payload)
r = requests.post(url, data=json.dumps(payload), headers=headers)
ret = r.content
print(ret.decode('ascii'))

