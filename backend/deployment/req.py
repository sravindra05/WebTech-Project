import json
import requests
import sys

url = 'http://192.168.99.100:32468/register/bank/'
payload = {'imei': 12345,'bankID':"onion",'mob':90901}
headers = {'content-type': 'application/json'}
print(payload)
r = requests.post(url, data=json.dumps(payload), headers=headers)
ret = r.content
print(ret.decode('ascii'))

