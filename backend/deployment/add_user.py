import json
import requests
import sys
import hashlib
url = 'http://34.70.190.85:80/api/new/'
payload = {'bank':"2",'phone_number':str(hashlib.sha256("9449005666".encode('utf-8')).hexdigest())}
headers = {'content-type': 'application/json'}
print(payload)
r = requests.post(url, data=json.dumps(payload), headers=headers)
ret = r.content
print(ret.decode('ascii'))
