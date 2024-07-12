import json
import random
import datetime

def generate_data(num_records):
    data = []
    email_base = "gastroenterologyname{}@gmail.com"
    ph_base = 6200300000
    for i in range(1, num_records+1):
        # Generate random DOB within a range (e.g., between 1940 and 2000)
        start_date = datetime.date(1940, 1, 1)
        end_date = datetime.date(2024, 4, 18)
        random_dob = start_date + datetime.timedelta(days=random.randint(0, (end_date - start_date).days))

        record = {
            "name": "Gastroenterologyname{}".format(i),
            "email": email_base.format(i),
            "dob": random_dob.strftime("%Y-%m-%d"),
            "gender": "Male" if i % 2 == 1 else "Female",
            "address": {
                "state": "address_1",
                "city": "address_2",
                "vill_or_town": "address_3"
            },
            "ph": str(ph_base + i - 1),
            "password": "password",
            "department": "Gastroenterology"
        }
        data.append(record)
    return data

def write_to_file(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    num_records = 20000  # Change this to the number of records you want to generate
    data = generate_data(num_records)
    write_to_file(data, "Gastroenterology_data.json")
