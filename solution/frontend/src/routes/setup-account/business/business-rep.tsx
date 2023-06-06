import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "../../../components/ImageInput";
import { CompanyRep, useSetupAccountContext } from "../setup-account";

export default function CompanyRepInfo() {
  const { companyRepForm, accountForm, companyInfoForm } = useSetupAccountContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = companyRepForm;

  const imageBlob = watch("companyRepPhoto");

  const [validImg, setValidImg] = useState(true);
  const [wasValidated, setWasValidated] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CompanyRep> = (data) => {
    const formData = { ...data, accountType, ...companyInfoForm.getValues() };
    setWasValidated(true);

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
    <form
      className={`container needs-validation mt-3 p-md-0 ${wasValidated ? "was-validated" : ""}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset>
        <legend className="h1">Company Representative</legend>
        <p className="text-muted required">Indicates a required field</p>

        {/* Image View */}

        <ImageInput
          imageField="companyRepPhoto"
          imageBlob={imageBlob}
          setValue={setValue}
          setValidImg={setValidImg}
        />

        <div className="row mb-3">
          <label htmlFor="companyRole" className="col-12 col-md-auto col-form-label required">
            Company Role
          </label>
          <div className="col">
            <input
              type="text"
              id="companyRole"
              className={`form-control ${errors.companyRole ? "is-invalid" : ""}`}
              pattern="^[A-Z][a-z]{2,}$"
              autoCapitalize="words"
              title="Company name must be capitalized"
              aria-describedby="companyRoleFeedback"
              aria-invalid={errors.companyRole ? "true" : "false"}
              required
              {...register("companyRole")}
            />
            {errors.companyRole && (
              <div id="companyRoleFeedback" className="invalid-feedback">
                Company name must be capitalized.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="companyRepFirstName" className="col-12 col-md-auto col-form-label required">
            First Name
          </label>
          <div className="col">
            <input
              type="text"
              id="companyRepFirstName"
              className={`form-control ${errors.companyRepFirstName ? "is-invalid" : ""}`}
              pattern="^[A-Z][a-z]{2,}$"
              autoCapitalize="words"
              title="First name must be capitalized"
              aria-describedby="companyRepFirstNameFeedback"
              aria-invalid={errors.companyRepFirstName ? "true" : "false"}
              required
              {...register("companyRepFirstName")}
            />
            {errors.companyRepFirstName && (
              <div id="companyRepFirstNameFeedback" className="invalid-feedback">
                First name must be capitalized.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="companyRepLastName" className="col-12 col-md-auto col-form-label required">
            Last Name
          </label>
          <div className="col">
            <input
              type="text"
              id="companyRepLastName"
              className={`form-control ${errors.companyRepLastName ? "is-invalid" : ""}`}
              pattern="^[A-Z][a-z]{2,}$"
              autoCapitalize="words"
              title="Last name must be capitalized"
              aria-describedby="companyRepLastNameFeedback"
              aria-invalid={errors.companyRepLastName ? "true" : "false"}
              required
              {...register("companyRepLastName")}
            />
            {errors.companyRepLastName && (
              <div id="companyRepLastNameFeedback" className="invalid-feedback">
                Last name must be capitalized.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="companyRepPhone" className="col-12 col-md-auto col-form-label required">
            Phone
          </label>
          <div className="col">
            <input
              type="tel"
              id="companyRepPhone"
              className={`form-control ${errors.companyRepPhone ? "is-invalid" : ""}`}
              pattern="^(\d{1,3})(\d{2})(\d{9})$"
              aria-describedby="companyRepPhoneFeedback"
              aria-invalid={errors.companyRepPhone ? "true" : "false"}
              required
              {...register("companyRepPhone")}
            />
            <small className="form-text">
              Type the numbers only. Required format: (Country Code)(Region Code)(Phone number).
            </small>
            {errors.companyRepPhone && (
              <div id="companyRepPhoneFeedback" className="invalid-feedback">
                Invalid phone number.
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 d-flex">
            <button
              type="button"
              className="btn btn-primary flex-grow-1 flex-md-grow-0 align-self-center px-4"
              onClick={() => reset()}
            >
              Reset
            </button>
          </div>
          <div className="col-12 col-md-5 offset-md-1 d-flex justify-content-between gap-3 mt-3 mb-3">
            <button type="button" className="btn btn-primary flex-grow-1 position-relative">
              <Link to={"../business"} className="stretched-link btn-link-custom">
                Back
              </Link>
            </button>

            <button type="submit" className="btn btn-primary flex-grow-1" disabled={!isValid}>
              Submit
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
