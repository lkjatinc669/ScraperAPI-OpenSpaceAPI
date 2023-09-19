import requests

file = "./artof.pdf"
import os
# print(os.getcwd())
url = "http://localhost:6693/scraper/addbooks"

files = {'upload_file': open(file,'rb')}

r = requests.post(url, files=files)

print(r.json())