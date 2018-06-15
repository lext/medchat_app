from pymongo import MongoClient
import uuid
import hashlib
from bson.objectid import ObjectId
if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    for entry in client['medchat']['messages'].find({}):
        print(entry)
