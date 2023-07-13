from django.forms import ValidationError
from django.test import TestCase

from solution.models import Job


class JSONFieldsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.job = Job.objects.create(
            title="test",
            company_rep="test",
            company_name="test",
            company_description="test",
            description="test",
            location="test",
            types=["Part-Time"],
            shifts=["Day Shift"],
            responsibilities=["test"],
            qualifications=["test"],
            benefits=["test"],
            min_salary=0,
            max_salary=1_000_000,
            period_salary="test",
            application_instructions="test",
            tags=["Temporary"],
        )

    def test_json_fields(self):
        fields = {
            "title": "test",
            "company_rep": "test",
            "company_name": "test",
            "company_description": "test",
            "description": "test",
            "location": "test",
            "responsibilities": ["test"],
            "qualifications": ["test"],
            "benefits": ["test"],
            "min_salary": 0,
            "max_salary": 1000000,
            "period_salary": "test",
            "application_instructions": "test",
        }

        self.assertRaisesMessage(
            ValidationError,
            "test is not a valid job type",
            Job.objects.create,
            types=["test"],
            shifts=["Day Shift"],
            tags=["Temporary"],
            **fields,
        )
        self.assertRaisesMessage(
            ValidationError,
            "test is not a valid shift",
            Job.objects.create,
            types=["Overtime"],
            shifts=["test"],
            tags=["Temporary"],
            **fields,
        )
        self.assertRaisesMessage(
            ValidationError,
            "test is not a valid tag",
            Job.objects.create,
            types=["Overtime"],
            shifts=["12 Hour Shift"],
            tags=["test"],
            **fields,
        )

        self.assertEqual(self.job.types, ["Part-Time"])
        self.assertEqual(self.job.shifts, ["Day Shift"])
        self.assertEqual(self.job.tags, ["Temporary"])


class TextFieldsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.job = Job.objects.create(
            title="test",
            company_rep="test",
            company_name="test",
            company_description="test",
            description="test",
            location="test",
            types=["Part-Time"],
            shifts=["Day Shift"],
            responsibilities=["test"],
            qualifications=["test"],
            benefits=["test"],
            min_salary=0,
            max_salary=1_000_000,
            period_salary="test",
            application_instructions="test",
            tags=["Temporary"],
        )
