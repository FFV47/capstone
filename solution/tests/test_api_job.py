from rest_framework.test import APITestCase


class JobDataTestCase(APITestCase):
    def test_job_data_api(self):
        response = self.client.get("/solution-api/job-data")
        assert response.status_code == 200
        assert isinstance(response.data, dict)
        assert "job_types" in response.data
        assert "shifts" in response.data
        assert "days_schedule" in response.data
        assert "tags" in response.data
        assert len(response.data["job_types"]) > 0
        assert len(response.data["shifts"]) > 0
        assert len(response.data["days_schedule"]) > 0
        assert len(response.data["tags"]) > 0
