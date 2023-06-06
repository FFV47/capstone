import json

from solution.models import Role, User

with open("db_json/db.json") as db:
    json = json.loads(db.read())
    role_objs = [Role(name=role) for role in json["roles"]]

    roles = Role.objects.bulk_create(role_objs)


User.objects.create_superuser(username="fernando", email="fernando@email.com", password="123")  # type: ignore

new_user = User()
new_user.first_name = "John"
new_user.last_name = "Doe"
new_user.username = "johndoe"
new_user.email = "john@email.com"
new_user.password = "123"
new_user.save()


new_user = User()
new_user.first_name = "Jane"
new_user.last_name = "Doe"
new_user.username = "janedoe"
new_user.email = "jane@email.com"
new_user.password = "123"
new_user.save()
