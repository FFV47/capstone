import orjson

data = [
    {
        "logo": None,
        "companyName": "Brave",
        "address": "128379",
        "legalName": "Brave",
        "industry": "Arts",
        "companySize": "Fewer than 10 employees",
        "location": "New York",
        "companyUrl": "",
        "description": "",
        "personalPhoto": None,
        "role": "Consultant",
        "firstName": "Fernando",
        "lastName": "Flores",
        "phone": "12345918723897",
    }
]

result = orjson.dumps(data, option=orjson.OPT_INDENT_2)

print(result)
