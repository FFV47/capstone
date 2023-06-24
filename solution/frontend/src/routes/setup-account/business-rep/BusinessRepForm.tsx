import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import BsHorizonralInput from "../BsHorizontalInput";
import { CompanyRep, useSetupAccountContext } from "../SetupAccount";

export default function BusinessRepForm() {
  const { companyRepForm, accountForm, companyInfoForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = companyRepForm;

  const imageBlob = watch("photo");

  const [validImg, setValidImg] = useState(true);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CompanyRep> = (data) => {
    const formData = { ...data, accountType, ...companyInfoForm.getValues() };
    setValidated(true);

    if (validImg) {
      console.log(formData);
    }
  };

  const accountType = accountForm.getValues("accountType");

  useEffect(() => {
    if (!accountType) {
      navigate("..");
    }
  }, [accountType, navigate, trigger]);

  return (
    <Form id="business-rep-form" validated={validated} noValidate onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend className="h1">Company Representative</legend>
        <p className="text-muted required">Indicates a required field</p>

        {/* Image View */}
        <ImageInput
          imageField="photo"
          imageBlob={imageBlob}
          setValue={setValue}
          setValidImg={setValidImg}
        />

        <BsHorizonralInput
          type="text"
          register={register}
          field="role"
          label="Company Role"
          fieldError={errors.role}
          required
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="Company role must be capitalized"
        />

        <BsHorizonralInput
          type="text"
          register={register}
          field="firstName"
          label="First Name"
          fieldError={errors.firstName}
          required
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="First name must be capitalized"
        />
        <BsHorizonralInput
          type="text"
          register={register}
          field="lastName"
          label="Last Name"
          fieldError={errors.firstName}
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="Last name must be capitalized"
        />
        <BsHorizonralInput
          type="tel"
          register={register}
          field="phone"
          label="Phone number"
          fieldError={errors.phone}
          pattern="(\d{1,3})(\d{2})(\d{9})"
        />

        <Row>
          <Col xs={12} md={6} className="d-flex">
            <button
              type="button"
              className="btn btn-primary flex-grow-1 flex-md-grow-0 align-self-center px-4"
              onClick={() => reset()}
            >
              Reset
            </button>
          </Col>
          <Col
            xs={12}
            md={5}
            className="offset-md-1 d-flex justify-content-between gap-3 mt-3 mb-3"
          >
            <button type="button" className="btn btn-primary flex-grow-1 position-relative">
              <Link to={"../business"} className="stretched-link btn-link-custom">
                Back
              </Link>
            </button>

            <button type="submit" className="btn btn-primary flex-grow-1">
              Submit
            </button>
          </Col>
        </Row>
      </fieldset>
    </Form>
  );
}
