import personalIcon from "../../assets/personalIcon.png";
import businessIcon from "../../assets/businessIcon.png";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Account, useSetupAccountContext } from "./setup-account";
import { useState } from "react";

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
    <form
      className="container-sm flex-grow-1 d-flex justify-content-center flex-wrap px-4 p-md-0 mt-1 needs-validation"
      onSubmit={handleSubmit(onSubmitSuccess, () => setShowError(true))}
      noValidate
    >
      <fieldset className="d-flex flex-column mb-3">
        <legend className="h1 text-center text-md-start">I want to</legend>
        <div className="row row-cols-2 flex-grow-1 flex-md-grow-0 justify-content-between align-items-center gap-3 m-0 my-md-4">
          <label
            className={`col-12 col-md-5 p-3 account-type ${accountType === "business" ? "selected" : ""}`}
          >
            <input
              type="radio"
              autoComplete="off"
              className="btn-check"
              value="business"
              required
              {...register("accountType")}
            />
            <img className="account-form-icon m-auto" src={businessIcon} alt="Contractor Icon" />
            <p className="h5 text-center mt-3">HIRE WORKERS</p>
            <p className="text-center">
              For businesses looking to hire for short-term and ongoing project work.
            </p>
          </label>
          <label
            className={`col-12 col-md-5 p-3 account-type ${accountType === "personal" ? "selected" : ""}`}
          >
            <input
              type="radio"
              autoComplete="off"
              className="btn-check"
              value="personal"
              {...register("accountType")}
            />
            <img className="account-form-icon m-auto" src={personalIcon} alt="ToolBox Icon" />
            <p className="h5 text-center mt-3">FIND WORK</p>
            <p className="text-center">For personal or domestic projects including home build and DIY.</p>
          </label>
        </div>

        <div className={`alert alert-danger mt-3 ${showError ? "d-block" : "d-none"}`}>
          Please select one of these options.
        </div>

        <div className="d-flex mt-2 justify-content-md-end">
          <button
            type="submit"
            className="btn btn-primary btn-rfs flex-grow-1 flex-md-grow-0 px-4"
            disabled={!accountType}
          >
            Next
          </button>
        </div>
      </fieldset>
    </form>
  );
}
