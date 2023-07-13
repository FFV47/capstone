from typing import Any, TypedDict, get_type_hints

from django.db import models

from solution.models import BaseModel, BusinessAccount, PersonalAccount

print(BusinessAccount.CompanySize.labels[3])
