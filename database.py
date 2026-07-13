#importing libraries
import certifi
from pymongo import MongoClient


uri="mongodb+srv://x23353252_db_user:<db_password>@nexusdatabase.kg5edmm.mongodb.net/"
#e34we9ZpboRlMUJB
client=MongoClient(uri,tlsCAFile=certifi.where())

try:
    client.admin.command('ping')
    print("Connected to database.")
except Exception as e:
    print(e)

database=client['NexusDatabase']
cluster=database['NexusDatabase']

data={
    "Username":"user1",
    "Password":"password1",
    "email":"email1@email.com"
}
cluster.insert_one(data)
print(data)