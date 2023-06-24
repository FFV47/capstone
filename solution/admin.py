from django.contrib import admin

# Register your models here.
from .models import (
    BusinessAccount,
    DaysSchedule,
    JobTag,
    JobType,
    PersonalAccount,
    Role,
    Shift,
    User,
    WorkSchedules,
)


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "first_name", "last_name")


class RoleAdmin(admin.ModelAdmin):
    list_display = ("name",)


class JobTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


class ShiftAdmin(admin.ModelAdmin):
    list_display = ("name",)


class DaysScheduleAdmin(admin.ModelAdmin):
    list_display = ("name",)


class JobTagAdmin(admin.ModelAdmin):
    list_display = ("name",)


class PersonalAccountAdmin(admin.ModelAdmin):
    pass


class BusinessAccountAdmin(admin.ModelAdmin):
    pass


class WorkSchedulesAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(PersonalAccount, PersonalAccountAdmin)
admin.site.register(BusinessAccount, BusinessAccountAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(WorkSchedules, WorkSchedulesAdmin)
admin.site.register(JobType, JobTypeAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(DaysSchedule, DaysScheduleAdmin)
admin.site.register(JobTag, JobTagAdmin)
