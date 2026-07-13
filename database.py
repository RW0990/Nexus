#importing libraries
from pymongo import MongoClient

MongoConnect=MongoClient()
from mongodblink import mongodb

MongoConnect=MongoClient(mongodb)['Link']

cluster=MongoConnect['NexusDatabase']
user=cluster['']

data={
    "Username":"user1",
    "Password":"password1",
    "email":"email1@email.com"
}
user.insert_one(data)