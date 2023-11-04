from django.contrib import admin

# Register your models here.
from solution import models


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "first_name", "last_name")


class ProfessionAdmin(admin.ModelAdmin):
    list_display = ("name",)


class JobTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


class ShiftAdmin(admin.ModelAdmin):
    list_display = ("name",)


class DaysScheduleAdmin(admin.ModelAdmin):
    list_display = ("name",)


class JobTagAdmin(admin.ModelAdmin):
    list_display = ("name",)


class WorkerAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "first_name", "last_name")


class EmployerAccountAdmin(admin.ModelAdmin):
    pass


class JobAdmin(admin.ModelAdmin):
    pass


class ContractAdmin(admin.ModelAdmin):
    pass


class EmployerFeedbackAdmin(admin.ModelAdmin):
    pass


class WorkerFeedbackAdmin(admin.ModelAdmin):
    pass


class WorkSchedulesAdmin(admin.ModelAdmin):
    pass


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Profession, ProfessionAdmin)
admin.site.register(models.JobType, JobTypeAdmin)
admin.site.register(models.Shift, ShiftAdmin)
admin.site.register(models.DaysSchedule, DaysScheduleAdmin)
admin.site.register(models.JobTag, JobTagAdmin)
admin.site.register(models.WorkerAccount, WorkerAccountAdmin)
admin.site.register(models.EmployerAccount, EmployerAccountAdmin)
admin.site.register(models.Job, JobAdmin)
admin.site.register(models.Contract, ContractAdmin)
admin.site.register(models.EmployerFeedback, EmployerFeedbackAdmin)
admin.site.register(models.WorkerFeedback, WorkerFeedbackAdmin)
admin.site.register(models.WorkSchedules, WorkSchedulesAdmin)
