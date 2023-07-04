from solution.models import PersonalAccount

obj = PersonalAccount.objects.get(user=1)
print(obj)
