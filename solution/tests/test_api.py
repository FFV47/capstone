from django.test import TestCase
from rest_framework.test import APIClient


class JobDataTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_job_data_api(self):
        response = self.client.get("solution-api/job-data", format="json")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "job_types")
        self.assertContains(response, "shifts")
        self.assertContains(response, "days_schedule")
        self.assertContains(response, "tags")
        self.assertGreater(len(response.data["job_types"]), 0)  # type: ignore
        self.assertGreater(len(response.data["shifts"]), 0)  # type: ignore
        self.assertGreater(len(response.data["days_schedule"]), 0)  # type: ignore
        self.assertGreater(len(response.data["tags"]), 0)  # type: ignore
