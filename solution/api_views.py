from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from solution.models import DaysSchedule, JobTag, JobType, Role, Shift


@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "roles": reverse("solution:roles", request=request, format=format),
            "job-data": reverse("solution:job-data", request=request, format=format),
        }
    )


@api_view(["GET"])
def roles(request, format=None):
    roles = Role.objects.all()
    return Response([x.name for x in roles])


@api_view(["GET"])
def job_data(request, format=None):
    job_types = JobType.objects.all()
    shifts = Shift.objects.all()
    days_schedule = DaysSchedule.objects.all()
    tags = JobTag.objects.all()

    # sleep(100)
    # return Response("hello")
    return Response(
        {
            "job_types": [x.name for x in job_types],
            "shifts": [x.name for x in shifts],
            "days_schedule": [x.name for x in days_schedule],
            "tags": [x.name for x in tags],
        }
    )
