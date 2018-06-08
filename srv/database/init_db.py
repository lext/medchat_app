from pymongo import MongoClient
import uuid
import hashlib

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


    # Doctors
    tmp = [
        {
            "person": people.find_one({"Ssn": "170975-050J"})['_id'], # Mona Sax
            "specialization": specialization.find_one({"Name": "GP"})['_id'],
        },
        {
            "person": people.find_one({"Ssn": "150280-89J0"})['_id'], # Alyx Vance
            "specialization": specialization.find_one({"Name": "PT"})['_id'],
        },
        {
            "person": people.find_one({"Ssn": "090182-9300"})['_id'], # Geralt of Rivia
            "specialization": specialization.find_one({"Name": "NL"})['_id'],
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
    salts = [uuid.uuid4().hex, uuid.uuid4().hex, uuid.uuid4().hex]
    print(salts)
    tmp = [
        {
            "person": people.find_one({"Ssn": "221181-289H"})['_id'], # Gordon Freeman
            "salt": salts[0],
            "password": hashlib.sha256(salts[0].encode() + "test1".encode()).hexdigest(),
        },
        {
            "person": people.find_one({"Ssn": "150280-89J0"})['_id'], # Alyx Vance
            "salt": salts[1],
            "password": hashlib.sha256(salts[1].encode() + "test2".encode()).hexdigest(),
        },
        {
            "person": people.find_one({"Ssn": "090182-9300"})['_id'], # Geralt of Rivia
            "salt": salts[2],
            "password": hashlib.sha256(salts[2].encode() + "test3".encode()).hexdigest(),

        }
    ]

    patients.insert_many(tmp)

    print(' ')
    print("Patients inserted:")
    print("=========================")
    for document in patients.find({}):
        print(document)
    print("=========================")
