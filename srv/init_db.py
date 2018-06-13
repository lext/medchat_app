from pymongo import MongoClient
import uuid
import hashlib
from bson.objectid import ObjectId
if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
#    try:
#        client.drop_database("medchat")
#    except:
#        pass
    client.drop_database("medchat")

    medchat_db = client['medchat']
    people = medchat_db["people"]
    doctors = medchat_db["doctors"]
    patients = medchat_db["patients"]
    specialization = medchat_db["specialization"]
    appointments = medchat_db["appointments"]
    # Fake data (people)
    tmp = [
        {
            "Ssn":"221181-289H",
            "Name": "Gordon",
            "Surname":"Freeman",
            "Sex":"M"
        },
        {
            "Ssn":"120557-6990",
            "Name": "Niko",
            "Surname":"Belic",
            "Sex":"M"
        },
        {
            "Ssn":"090182-9300",
            "Name": "Geralt",
            "Surname":"Rivia",
            "Sex":"M"
        },
        {
            "Ssn":"230287-1234",
            "Name": "April",
            "Surname":"Ryan",
            "Sex":"F"
        },
        {
            "Ssn":"150280-89J0",
            "Name": "Alyx",
            "Surname":"Vance",
            "Sex":"F"
        },
        {
            "Ssn":"170975-050J",
            "Name": "Mona",
            "Surname":"Sax",
            "Sex":"F"
        },
    ]
    people.insert_many(tmp)

    print(' ')
    print("People inserted:")
    print("=========================")
    for document in people.find({}):
        print(document)
    print("=========================")

    # Specialization
    tmp = [
        {
            "Name": "GP" # General practicioner
        },
        {
            "Name": "PT" # Physiotherapist
        },
        {
            "Name": "NL" # Neurologist
        },
        {
            "Name": "PR" # Pediatrist
        }
    ]
    specialization.insert_many(tmp)

    print(' ')
    print("Specializations inserted:")
    print("=========================")
    for document in specialization.find({}):
        print(document)
    print("=========================")

    salts = []
    passwords = []
    for i in range(6):
        salt = uuid.uuid4().hex
        salts.append(salt)
        passwords.append(hashlib.sha256(salt.encode() + "test{}".format(i+1).encode()).hexdigest())

    print(salts)
    print(passwords)


    # Doctors
    tmp = [
        {
            "person": people.find_one({"Ssn": "170975-050J"})['_id'], # Mona Sax
            "specialization": specialization.find_one({"Name": "GP"})['_id'],
            "salt": salts[0],
            "password": passwords[0],
        },
        {
            "person": people.find_one({"Ssn": "150280-89J0"})['_id'], # Alyx Vance
            "specialization": specialization.find_one({"Name": "PT"})['_id'],
            "salt": salts[1],
            "password": passwords[1],

        },
        {
            "person": people.find_one({"Ssn": "090182-9300"})['_id'], # Geralt of Rivia
            "specialization": specialization.find_one({"Name": "NL"})['_id'],
            "salt": salts[2],
            "password": passwords[2],

        }
    ]

    doctors.insert_many(tmp)

    print(' ')
    print("Doctors inserted:")
    print("=========================")
    for document in doctors.find({}):
        print(document)
    print("=========================")

    # Patients
    tmp = [
        {
            "person": people.find_one({"Ssn": "221181-289H"})['_id'], # Gordon Freeman
            "salt": salts[3],
            "password": passwords[3],
        },
        {
            "person": people.find_one({"Ssn": "150280-89J0"})['_id'], # Alyx Vance
            "salt": salts[4],
            "password": passwords[4],
        },
        {
            "person": people.find_one({"Ssn": "090182-9300"})['_id'], # Geralt of Rivia
            "salt": salts[5],
            "password": passwords[5],

        }
    ]

    patients.insert_many(tmp)

    print(' ')
    print("Patients inserted:")
    print("=========================")
    for document in patients.find({}):
        print(document)
    print("=========================")


    # Appointments (conversations)
    tmp = [
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "150280-89J0"})['_id'])})['_id'], # Alyx Vance
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "221181-289H"})['_id'])})['_id'], # Gordon Freeman
            "is_happening": True,

        },
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "150280-89J0"})['_id'])})['_id'], # Alyx Vance
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "221181-289H"})['_id'])})['_id'], # Gordon Freeman
            "is_happening": False,
        },
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "150280-89J0"})['_id'])})['_id'], # Alyx Vance
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "221181-289H"})['_id'])})['_id'], # Gordon Freeman
            "is_happening": False,

        },
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "090182-9300"})['_id'])})['_id'], # Geralt of Rivia
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "150280-89J0"})['_id'])})['_id'], # # Alyx Vance
            "is_happening": True,

        },
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "090182-9300"})['_id'])})['_id'], # Geralt of Rivia
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "221181-289H"})['_id'])})['_id'], # cGeralt of Rivia
            "is_happening": False,
        },
        {
            "doctor": doctors.find_one({'person':ObjectId(people.find_one({"Ssn": "090182-9300"})['_id'])})['_id'], # Alyx Vance
            "patient": patients.find_one({'person':ObjectId(people.find_one({"Ssn": "221181-289H"})['_id'])})['_id'], # Gordon Freeman
            "is_happening": False,

        }
    ]

    appointments.insert_many(tmp)

    print(' ')
    print("Appointments inserted:")
    print("=========================")
    for document in appointments.find({}):
        print(document)
    print("=========================")
