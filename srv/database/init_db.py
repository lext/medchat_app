from pymongo import MongoClient
client = MongoClient()
client = MongoClient('mongodb://127.0.0.1:27017')
print(client.database_names())
medhchat_db = client.medchat
