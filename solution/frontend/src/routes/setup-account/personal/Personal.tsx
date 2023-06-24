import { useEffect, useState } from "react";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import { PersonalInfo, maxBirthDate, minBirthDate, useSetupAccountContext } from "../SetupAccount";

import { Col, Form, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { Controller, SubmitHandler } from "react-hook-form";
import { RootLoaderData } from "../../Root";
import BsHorizonralInput from "../BsHorizontalInput";

export default function PersonalInfo() {
  const roles = useRouteLoaderData("root") as RootLoaderData;

  const { personalInfoForm, accountForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = personalInfoForm;

  const imageBlob = watch("photo");

  const [validImg, setValidImg] = useState(true);
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<PersonalInfo> = (data) => {
    const formData = { ...data, accountType };
    setValidated(true);

    if (validImg) {
      console.log(formData);
      // console.log(formData.birthDate.toISOString());
    }
  };

  const accountType = accountForm.getValues("accountType");
  useEffect(() => {
    if (!accountType) {
      navigate("..");
    }
  }, [accountType, navigate]);

  return (
    <Form id="personal-form" onSubmit={handleSubmit(onSubmit)} validated={validated} noValidate>
      <fieldset>
        <legend className="h1">Worker Info</legend>
        <p className="text-muted required">Indicates a required field</p>

        <ImageInput
          imageField="photo"
          imageBlob={imageBlob}
          setValue={setValue}
          setValidImg={setValidImg}
        />

        <Form.Group as={Row} className="mb-3">
          <Form.Label column xs={12} md={3} className="required">
            Profession
          </Form.Label>

          <Col md={9}>
            <Form.Select as="select" required {...register("profession")}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

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
          fieldError={errors.lastName}
          required
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="Last name must be capitalized"
        />

        <Form.Group as={Row} className="mb-3" controlId="birthDate">
          <Form.Label column xs={12} md={3} className="required">
            Birth Date
          </Form.Label>

          <Col md={9}>
            <Controller
              control={control}
              name="birthDate"
              rules={{ required: true }}
              render={({ field }) => (
                <ReactDatePicker
                  id="birthDate"
                  selected={field.value}
                  onChange={(date) => field.onChange(date as Date)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  showPopperArrow={false}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  placeholderText="Click to select your birthdate"
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  autoComplete="bday"
                  minDate={minBirthDate}
                  maxDate={maxBirthDate}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthDate?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <BsHorizonralInput
          type="tel"
          register={register}
          field="phone"
          label="Phone number"
          fieldError={errors.phone}
          required
          pattern="(\d{1,3})(\d{2})(\d{9})"
        />

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
          as="textarea"
          rows={3}
          register={register}
          field="aboutMe"
          label="About Me"
          fieldError={errors.aboutMe}
        />

        <div className="d-flex gap-4 justify-content-md-end mt-2 mb-3 p-0">
          <button
            type="button"
            className="btn btn-primary flex-grow-1 flex-md-grow-0 px-4 position-relative"
          >
            <Link to={".."} className="stretched-link btn-link-custom">
              Back
            </Link>
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-grow-1 flex-md-grow-0 px-4 position-relative"
          >
            Submit
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
