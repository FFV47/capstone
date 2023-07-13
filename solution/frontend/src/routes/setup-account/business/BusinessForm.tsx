import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import { CompanyInfo, useSetupAccountContext } from "../SetupAccount";
import BsHorizonralInput from "../BsHorizontalInput";

export default function BusinessForm() {
  const { accountForm, companyInfoForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = companyInfoForm;

  const imageBlob = watch("logo");
  const [validImg, setValidImg] = useState(true);
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CompanyInfo> = () => {
    setValidated(true);

    if (validImg) {
      navigate("../business-rep");
    }
  };

  const accountType = accountForm.getValues("accountType");

  useEffect(() => {
    // if (!accountType) {
    //   navigate("/setup-account");
    // }
  }, [accountType, navigate]);

  return (
    <Form id="business-form" onSubmit={handleSubmit(onSubmit)} validated={validated} noValidate>
      <fieldset>
        <legend className="h1">Company Information</legend>
        <p className="text-muted required">Indicates a required field</p>

        <ImageInput
          label="Company Logo"
          imageField="logo"
          imageBlob={imageBlob}
          setValue={setValue}
          setValidImg={setValidImg}
        />

        <BsHorizonralInput
          type="text"
          register={register}
          field="companyName"
          label="Company Name"
          fieldError={errors.companyName}
          required
          pattern="[A-Z][\w\s.]{1,}"
          autoCapitalize="words"
          title="Company name must be capitalized"
          placeholder="Brave, Microsoft..."
        />
        <BsHorizonralInput
          type="text"
          register={register}
          field="address"
          label="Company Address"
          fieldError={errors.address}
          required
          pattern="[\w\d\s.#]{2,}"
          autoCapitalize="words"
          title="At least 2 characters"
          placeholder="30 Frank Lloyd Wright Drive..."
        />
        <BsHorizonralInput
          type="text"
          register={register}
          field="legalName"
          label="Legal/Trading Name"
          fieldError={errors.legalName}
          required
          pattern="^[A-Z][\w\s.]{1,}"
          autoCapitalize="words"
          title="Legal name must be capitalized"
        />

        <BsHorizonralInput
          type="text"
          register={register}
          field="industry"
          label="Industry"
          fieldError={errors.industry}
          required
          pattern="^[A-Z][\w\s.,]{1,}"
          autoCapitalize="words"
          placeholder="Construction, Food Service, Transportation & Logistics..."
          title="Industry must be capitalized"
          list="industryOptions"
        />
        <datalist id="industryOptions">
          <option value="Agriculture" />
          <option value="Arts, Entertainment & Recreation" />
          <option value="Construction, Repair & Maintenance Services" />
          <option value="Education" />
          <option value="Energy, Mining & Utilities" />
          <option value="Financial Services" />
          <option value="Government & Public Administration" />
          <option value="Healthcare" />
          <option value="Hotels & Travel" />
          <option value="Human Resources & Staffing" />
          <option value="Information Technology" />
          <option value="Insurance" />
          <option value="Legal" />
          <option value="Management & Consulting" />
          <option value="Manufacturing" />
          <option value="Media & Communication" />
          <option value="Nonprofit & NGO" />
          <option value="Personal Consumer Services" />
          <option value="Pharmaceutical" />
          <option value="Real Estate" />
          <option value="Restaurants & Food Service" />
          <option value="Retail & Wholesale" />
          <option value="Telecommunications" />
          <option value="Transportation & Logistics" />
        </datalist>
        <fieldset className="mb-3">
          <legend className="required fs-6">Company Size</legend>
          <Form.Check
            id="size-micro"
            type="radio"
            label="Fewer than 10 employees"
            value="micro"
            isInvalid={Boolean(errors.companySize)}
            required
            {...register("companySize")}
          />
          <Form.Check
            id="size-small"
            type="radio"
            label="10 to 50 employees"
            value="small"
            isInvalid={Boolean(errors.companySize)}
            required
            {...register("companySize")}
          />
          <Form.Check
            id="size-medium"
            type="radio"
            label="50 to 250 employees"
            value="medium"
            isInvalid={Boolean(errors.companySize)}
            required
            {...register("companySize")}
          />
          <Form.Check
            id="size-large"
            type="radio"
            label="250 to 500 employees"
            value="large"
            isInvalid={Boolean(errors.companySize)}
            required
            {...register("companySize")}
          />
          <Form.Check
            id="size-enterprise"
            type="radio"
            label="More than 500 employees"
            value="enterprise"
            isInvalid={Boolean(errors.companySize)}
            feedback="Company size is required"
            feedbackType="invalid"
            required
            {...register("companySize")}
          />
        </fieldset>
        <BsHorizonralInput
          type="text"
          register={register}
          field="location"
          label="Location"
          fieldError={errors.location}
          required
          pattern="^[A-Z][\w\s.,]{1,}"
          autoCapitalize="words"
          title="Location must be capitalized"
          placeholder="New York, London..."
        />
        <BsHorizonralInput
          type="text"
          register={register}
          field="companyUrl"
          label="Website URL"
          fieldError={errors.companyUrl}
          pattern="https://.*"
          placeholder="https://example.com"
        />
        <BsHorizonralInput
          as="textarea"
          rows={3}
          register={register}
          field="description"
          label="Description"
          fieldError={errors.description}
        />

        <Row>
          <Col xs={12} md={8} className="d-flex">
            <button
              type="button"
              className="btn btn-primary flex-grow-1 flex-md-grow-0 align-self-center px-4"
              onClick={() => reset()}
            >
              Reset
            </button>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-between gap-3 mt-3 mb-3">
            <button type="button" className="btn btn-primary flex-grow-1 position-relative">
              <Link to={".."} className="stretched-link btn-link-custom">
                Back
              </Link>
            </button>

            <button type="submit" className="btn btn-primary flex-grow-1">
              Next
            </button>
          </Col>
        </Row>
      </fieldset>
    </Form>
  );
}
