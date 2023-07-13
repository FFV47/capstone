import { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import BsHorizonralInput from "../BsHorizontalInput";
import { CompanyRep, useSetupAccountContext } from "../SetupAccount";
import useStateReducer from "../../../hooks/useStateReducer";
import axios from "axios";
import { handleAxiosError, sleep } from "../../../utils/utils";
import { useRootContext } from "../../Root";

export default function BusinessRepForm() {
  const { dispatch: rootDispatch } = useRootContext();
  const { companyRepForm, accountForm, companyInfoForm } = useSetupAccountContext();
  const accountType = accountForm.getValues("accountType");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = companyRepForm;

  const imageBlob = watch("personalPhoto");

  const [state, dispatch] = useStateReducer({ validated: false, isSending: false });

  const [validImg, setValidImg] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!accountType) {
      navigate("..");
    }
  }, [accountType, navigate, trigger]);

  const onSubmit: SubmitHandler<CompanyRep> = async (data) => {
    const formData = { ...data, ...companyInfoForm.getValues(), accountType };

    if (validImg) {
      try {
        await sleep(2);
        await axios.postForm("/solution-api/business-account", formData);

        dispatch({ isSending: false });

        rootDispatch({
          showToast: true,
          toastHeader: "Business Account",
          toastBody: "Business account created successfully.",
        });
        navigate("/user");
      } catch (error) {
        handleAxiosError(error);
      }
    }
  };

  return (
    <Form
      id="business-rep-form"
      validated={state.validated}
      noValidate
      onSubmit={(e) => {
        dispatch({ validated: true, isSending: true });
        handleSubmit(onSubmit)(e);
      }}
    >
      <fieldset>
        <legend className="h1">Company Representative</legend>
        <p className="text-muted required">Indicates a required field</p>

        {/* Image View */}
        <ImageInput
          label="Personal Photo"
          imageField="personalPhoto"
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
              <Link to={"../business"} className="stretched-link btn-link-custom">
                Back
              </Link>
            </button>

            <button type="submit" className="btn btn-primary flex-grow-1">
              {state.isSending && (
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
          </Col>
        </Row>
      </fieldset>
    </Form>
  );
}
