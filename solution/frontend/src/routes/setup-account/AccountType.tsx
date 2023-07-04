import { useState } from "react";
import { Alert, Form, Row } from "react-bootstrap";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import businessIcon from "../../assets/businessIcon.png";
import personalIcon from "../../assets/personalIcon.png";
import { Account, useSetupAccountContext } from "./SetupAccount";

export default function AccountType() {
  const { accountForm } = useSetupAccountContext();
  const { register, handleSubmit, watch } = accountForm;
  const accountType = watch("accountType");

  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);

  const onSubmitSuccess: SubmitHandler<Account> = (data) => {
    setShowError(false);
    navigate(data.accountType);
  };

  return (
    <Form
      id="account-type"
      onSubmit={handleSubmit(onSubmitSuccess, () => setShowError(true))}
      noValidate
    >
      <fieldset className="mb-3">
        <legend className="h1 text-center text-md-start">I want to</legend>
        <Row className="justify-content-around align-items-center gap-3 m-0 my-md-4">
          <Form.Check
            type="radio"
            id="radio-business"
            className={`col-12 col-md-5 p-3 form-check-card ${
              accountType === "business" ? "selected" : ""
            }`}
          >
            <Form.Check.Input
              type="radio"
              autoComplete="off"
              required
              className="btn-check"
              value="business"
              {...register("accountType")}
            />
            <Form.Check.Label>
              <img className="card-form-img m-auto" src={businessIcon} alt="Contractor Icon" />
              <h5 className="text-center mt-3">HIRE WORKERS</h5>
              <p className="text-center">
                For businesses looking to hire for short-term and ongoing project work.
              </p>
            </Form.Check.Label>
          </Form.Check>
          <Form.Check
            type="radio"
            id="radio-personal"
            className={`col-12 col-md-5 p-3 form-check-card ${
              accountType === "personal" ? "selected" : ""
            }`}
          >
            <Form.Check.Input
              type="radio"
              autoComplete="off"
              required
              className="btn-check"
              value="personal"
              {...register("accountType")}
            />
            <Form.Check.Label>
              <img className="card-form-img m-auto" src={personalIcon} alt="ToolBox Icon" />
              <h5 className="text-center mt-3">FIND WORK</h5>
              <p className="text-center">
                For personal or domestic projects including home build and DIY.
              </p>
            </Form.Check.Label>
          </Form.Check>
        </Row>

        <Alert variant="danger" className={`mt-3 ${showError ? "d-block" : "d-none"}`}>
          Please select one of these options.
        </Alert>

        <div className="d-flex mt-2 justify-content-center">
          <button
            type="submit"
            className="btn btn-primary btn-rfs flex-grow-1 flex-md-grow-0 px-4"
            disabled={!accountType}
          >
            Next
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
