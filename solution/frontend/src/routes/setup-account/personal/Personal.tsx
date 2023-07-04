import { useEffect, useState } from "react";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import { PersonalInfo, maxBirthDate, minBirthDate, useSetupAccountContext } from "../SetupAccount";

import axios from "axios";
import { CloseButton, Col, Form, Row, Spinner } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { SubmitHandler, useWatch } from "react-hook-form";
import { handleAxiosError } from "../../../utils/utils";
import { RootLoaderData, useRootContext } from "../../Root";
import BsHorizonralInput from "../BsHorizontalInput";

export default function PersonalInfo() {
  const roles = useRouteLoaderData("root") as RootLoaderData;
  const { dispatch } = useRootContext();

  const { personalInfoForm, accountForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    resetField,
    control,
    formState: { errors },
  } = personalInfoForm;

  const { birthdate } = { ...useWatch({ control }), ...getValues() };

  const imageBlob = watch("photo");

  const [validImg, setValidImg] = useState(true);
  const [validated, setValidated] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<PersonalInfo> = async (data) => {
    const formData = {
      ...data,
      accountType,
      birthdate: data.birthdate.toISOString().substring(0, 10),
    };

    dispatch({
      showToast: true,
      toastHeader: "Personal Account",
      toastBody: "Account created successfully.",
    });

    if (validImg) {
      // await sleep(2);
      try {
        const { data: responseData } = await axios.postForm(
          "/solution-api/personal-account",
          formData
        );
        console.log({ responseData });
      } catch (error) {
        handleAxiosError(error);
      }
      setIsSending(false);
      navigate("/user");
    }
  };

  const accountType = accountForm.getValues("accountType");
  useEffect(() => {
    if (!accountType) {
      navigate("..");
    }
  }, [accountType, navigate]);

  return (
    <Form
      id="personal-form"
      onSubmit={(e) => {
        setValidated(true);
        handleSubmit(onSubmit)(e);
      }}
      validated={validated}
      noValidate
    >
      <fieldset>
        <legend className="h1">Worker Info</legend>
        <p className="text-muted required">Indicates a required field</p>

        <ImageInput
          label="Photo"
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
          field="first_name"
          label="First Name"
          fieldError={errors.first_name}
          required
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="First name must be capitalized"
        />
        <BsHorizonralInput
          type="text"
          register={register}
          field="last_name"
          label="Last Name"
          fieldError={errors.last_name}
          required
          pattern="^[A-Z][\w]{1,}"
          autoCapitalize="words"
          title="Last name must be capitalized"
        />

        <Form.Group as={Row} className="mb-3" controlId="birthDate">
          <Form.Label column xs={12} md={3} className="required">
            Birth Date
          </Form.Label>

          <Col md={9} className="d-flex align-items-center flex-wrap">
            <CloseButton className="ms-1 me-2" onClick={() => resetField("birthdate")} />
            <ReactDatePicker
              {...register("birthdate")}
              onChange={(date) => setValue("birthdate", date as Date)}
              required
              selected={birthdate}
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
            <div
              className="invalid-feedback"
              style={{ display: errors.birthdate ? "block" : "none" }}
            >
              {errors.birthdate?.message}
            </div>
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
          field="about"
          label="About Me"
          fieldError={errors.about}
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
            // onClick={() => setIsSending(true)}
          >
            {isSending && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            Submit
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
