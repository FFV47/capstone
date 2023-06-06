from django.contrib import admin

# Register your models here.
from .models import BusinessAccount, PersonalAccount, Role, User, WorkSchedules


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "first_name", "last_name")


class PersonalAccountAdmin(admin.ModelAdmin):
    pass


class BusinessAccountAdmin(admin.ModelAdmin):
    pass


class RoleAdmin(admin.ModelAdmin):
    pass


class WorkSchedulesAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(PersonalAccount, PersonalAccountAdmin)
admin.site.register(BusinessAccount, BusinessAccountAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(WorkSchedules, WorkSchedulesAdmin)
