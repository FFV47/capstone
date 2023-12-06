import datetime

from django.forms import ValidationError
from django.test import TestCase

from solution.models import Contract, EmployerAccount, Job, User


class JSONFieldsTestCase(TestCase):
    user: User
    employer: EmployerAccount

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("jack", "jack@email.com", "123")

        cls.employer = EmployerAccount.objects.create(
            user=cls.user,
            company_name="test",
            address="test",
            legal_name="test",
            industry="test",
            company_size="medium",
            location="test",
            role="test",
            first_name="john",
            last_name="doe",
            phone=918301923809,
            verified_id=True,
        )

        cls.job = Job.objects.create(
            title="test",
            employer=cls.employer,
            start_date=datetime.date(2023, 12, 15),
            # end_date=datetime.date(2024, 12, 15),
            description="test",
            location="test",
            types=["Part-Time"],
            shifts=["Day Shift"],
            responsibilities=["test"],
            qualifications=["test"],
            benefits=["test"],
            min_salary=0,
            max_salary=50_000,
            period_salary="test",
            application_instructions="test",
            tags=["Temporary"],
        )

    def test_json_fields(self):
        fields = {
            "title": "test",
            "start_date": "2022-01-01",
            "description": "test",
            "location": "test",
            "responsibilities": ["test"],
            "qualifications": ["test"],
            "benefits": ["test"],
            "min_salary": 0,
            "max_salary": 50000,
            "period_salary": "test",
            "application_instructions": "test",
        }

        with self.assertRaisesMessage(ValidationError, "test is not a valid job type"):
            Job.objects.create(
                types=["test"],
                shifts=["Day Shift"],
                tags=["Temporary"],
                **fields,
            )

        with self.assertRaisesMessage(ValidationError, "test is not a valid shift"):
            Job.objects.create(
                types=["Overtime"],
                shifts=["test"],
                tags=["Temporary"],
                **fields,
            )

        with self.assertRaisesMessage(ValidationError, "test is not a valid tag"):
            Job.objects.create(
                types=["Overtime"],
                shifts=["12 Hour Shift"],
                tags=["test"],
                **fields,
            )

        assert self.job.types == ["Part-Time"]
        assert self.job.shifts == ["Day Shift"]
        assert self.job.tags == ["Temporary"]


class ContractTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user("jack", "jack@email.com", "123")

        cls.employer = EmployerAccount.objects.create(
            user=user,
            company_name="test",
            address="test",
            legal_name="test",
            industry="test",
            company_size="medium",
            location="test",
            role="test",
            first_name="john",
        )

    def test_create_contract(self):
        with self.assertRaisesMessage(ValidationError, "Contract start date must be in the future"):
            Contract.objects.create(
                start_date=datetime.date(2020, 1, 1), end_date=datetime.date(2020, 1, 1)
            )
